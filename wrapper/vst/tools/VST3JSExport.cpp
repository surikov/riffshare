#include <stdio.h>
#include <string>
#include <sstream>
#include <cassert>
#include <memory>
#include <stdexcept>
#include <unordered_map>
#include <atomic>
#include <algorithm>
#include <vector>

#include "base/source/fstring.h"

#include "public.sdk/source/vst/vstaudioeffect.h"
#include "public.sdk/source/vst/hosting/processdata.h"
#include "public.sdk/source/vst/hosting/eventlist.h"
#include "public.sdk/source/vst/hosting/parameterchanges.h"

#include "pluginterfaces/base/ftypes.h"
#include "pluginterfaces/base/funknown.h"
#include "pluginterfaces/base/iupdatehandler.h"
#include "pluginterfaces/base/icloneable.h"
#include "pluginterfaces/base/ibstream.h"
#include "pluginterfaces/base/ipluginbase.h"
#include "pluginterfaces/base/ustring.h"
#include "pluginterfaces/base/ftypes.h"

#include "pluginterfaces/vst/ivstcomponent.h"
#include "pluginterfaces/vst/ivstaudioprocessor.h"
#include "pluginterfaces/vst/ivsthostapplication.h"
#include "pluginterfaces/vst/ivsteditcontroller.h"
#include "pluginterfaces/vst/ivstunits.h"
#include "pluginterfaces/vst/ivstprocesscontext.h"

#include "pluginterfaces/test/itest.h"

Steinberg::IPluginFactory* iPluginFactory;
Steinberg::PFactoryInfo pFactoryInfo;
Steinberg::Vst::IComponent* selectedComponent;
Steinberg::Vst::IAudioProcessor* selectedProcessor;
Steinberg::Vst::IEditController* selectedEditController;
Steinberg::FUnknown* localPluginContext = nullptr;

template<class T>
struct Buffer
{
	typedef T value_type;
	Buffer()
		:	channel_(0)
		,	sample_(0)
	{}

	Buffer(int num_channels, int num_samples)
	{
		resize(num_channels, num_samples);
	}

	int samples() const { return sample_; }
	int channels() const { return channel_; }

	value_type ** data() { return buffer_heads_.data(); }
	value_type const * const * data() const { return buffer_heads_.data(); }

	void resize(int num_channels, int num_samples)
	{
		std::vector<value_type> tmp(num_channels * num_samples);
		std::vector<value_type *> tmp_heads(num_channels);

		channel_ = num_channels;
		sample_ = num_samples;

		buffer_.swap(tmp);
		buffer_heads_.swap(tmp_heads);
		for (int i = 0; i < num_channels; ++i) {
			buffer_heads_[i] = buffer_.data() + (i * num_samples);
		}
	}

	void resize_samples(int num_samples)
	{
		resize(channels(), num_samples);
	}

	void resize_channels(int num_channels)
	{
		resize(num_channels, samples());
	}

public:
	std::vector<value_type> buffer_;
	std::vector<value_type *> buffer_heads_;

	int channel_;
	int sample_;
};

struct AudioBus
{
	typedef Buffer<float> buffer_type;

	AudioBus()
		:	speaker_arrangement_(Steinberg::Vst::SpeakerArr::kEmpty)
	{}

	void SetBlockSize(int num_samples)
	{
		buffer_.resize_samples(num_samples);
	}

	void SetChannels(int num_channels, Steinberg::Vst::SpeakerArrangement speaker_arrangement)
	{
		buffer_.resize_channels(num_channels);
		speaker_arrangement_ = speaker_arrangement;
	}

	int channels() const
	{
		return buffer_.channels();
	}

	float **data()
	{
		return buffer_.data();
	}

	float const * const * data() const
	{
		return buffer_.data();
	}

	Steinberg::Vst::SpeakerArrangement GetSpeakerArrangement() const
	{
		return speaker_arrangement_;
	}

private:
	buffer_type buffer_;
	Steinberg::uint64 speaker_arrangement_;
};

struct AudioBuses
{
	AudioBuses()
		:	block_size_(0)
	{}

	AudioBuses(AudioBuses &&rhs)
		:	buses_(std::move(rhs.buses_))
		,	block_size_(rhs.block_size_)
	{}

	AudioBuses & operator=(AudioBuses &&rhs)
	{
		buses_ = std::move(rhs.buses_);
		block_size_ = rhs.block_size_;

		rhs.block_size_ = 0;
		return *this;
	}

	int GetBusCount() const
	{
		return buses_.size();
	}

	void SetBusCount(int n)
	{
		buses_.resize(n);
	}

	int GetBlockSize() const
	{
		return block_size_;
	}

	void SetBlockSize(int num_samples)
	{
		for (auto &bus : buses_) {
			bus.SetBlockSize(num_samples);
		}
		block_size_ = num_samples;
	}

	AudioBus & GetBus(int index)
	{
		return buses_[index];
	}

	AudioBus const & GetBus(int index) const
	{
		return buses_[index];
	}

	void UpdateBufferHeads()
	{
		int n = 0;
		for (auto const &bus : buses_) {
			n += bus.channels();
		}

		std::vector<float *> tmp_heads(n);
		n = 0;
		for (auto &bus : buses_) {
			for (int i = 0; i < bus.channels(); ++i) {
				tmp_heads[n] = bus.data()[i];
				++n;
			}
		}

		heads_ = std::move(tmp_heads);
	}

	float ** data()
	{
		return heads_.data();
	}

	float const * const * data() const
	{
		return heads_.data();
	}

	int GetTotalChannels() const
	{
		return heads_.size();
	}

private:
	int block_size_;
	std::vector<AudioBus> buses_;
	std::vector<float *> heads_;
};
AudioBuses output_buses_;
AudioBuses input_buses_;

extern "C" {

	int VST3_init() {
		iPluginFactory = GetPluginFactory();
		iPluginFactory->getFactoryInfo (&pFactoryInfo);
		return -1;
	}
	char const* VST3_classInfo(int nn) {
		Steinberg::PClassInfo pClassInfo;
		iPluginFactory->getClassInfo (nn, &pClassInfo);
		char buffer[999];
		Steinberg::FUID fuid = Steinberg::FUID::fromTUID(pClassInfo.cid);
		Steinberg::char8 strUID[33] = {0};
		fuid.toString (strUID);
		snprintf(buffer, sizeof(buffer)
		         , "{\"name\":\"%s\", \"category\":\"%s\" , \"cid\":\"%s\"}"
		         , pClassInfo.name
		         , pClassInfo.category
		         , strUID
		        );
		char const *p = buffer;
		return p;
	}
	int VST3_parametersCount() {
		return selectedEditController->getParameterCount();
	}
	char const* VST3_parameterInfo(int nn) {
		char buffer[999];
		Steinberg::Vst::ParameterInfo parameterInfo;
		selectedEditController->getParameterInfo (nn, parameterInfo);

		Steinberg::UString128 title16 (parameterInfo.title);
		char title8[128];
		title16.toAscii (title8, 128);

		Steinberg::UString128 shortTitle16 (parameterInfo.shortTitle);
		char shortTitle8[128];
		shortTitle16.toAscii (shortTitle8, 128);

		Steinberg::UString128 units16 (parameterInfo.units);
		char units8[128];
		units16.toAscii (units8, 128);

		snprintf(buffer, sizeof(buffer)
		         , "{\"nn\":\"%d\", \"title\":\"%s\", \"shortTitle\":\"%s\", \"units\":\"%s\", \"flags\":\"%d\"}"
		         , nn
		         , title8//parameterInfo.title
		         , shortTitle8//parameterInfo.shortTitle
		         , units8//parameterInfo.units
		         , parameterInfo.flags
		        );
		char const *p = buffer;
		return p;
	}
	int VST3_selectProcessor(int nn) {
		Steinberg::PClassInfo pClassInfo;
		iPluginFactory->getClassInfo (nn, &pClassInfo);
		int step = 10000;
		int result = iPluginFactory->createInstance (pClassInfo.cid, Steinberg::Vst::IComponent::iid, (void**)&selectedComponent);
		if (result == Steinberg::kResultOk) {
			step = 20000;
			result = selectedComponent->initialize (localPluginContext);
			step = 30000;
			if (selectedComponent->queryInterface (Steinberg::Vst::IEditController::iid, (void**)&selectedEditController) != Steinberg::kResultTrue)
			{
				step = 40000;
				Steinberg::TUID controllerCID;
				result = selectedComponent->getControllerClassId (controllerCID);
				if (result == Steinberg::kResultOk)
				{
					step = 50000;
					result = iPluginFactory->createInstance (controllerCID, Steinberg::Vst::IEditController::iid, (void**)&selectedEditController);
					if (selectedEditController && (result == Steinberg::kResultOk))
					{
						step = 60000;
						result = selectedEditController->initialize (localPluginContext);
						step = 70000;
						Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
						if (!selectedProcessor) {
							return false;
						} else {
							step = 80000;
							result = selectedProcessor->getLatencySamples();
							step = 90000;
							selectedProcessor->setProcessing (true);
							step = 100000;
							//Steinberg::Vst::HostProcessData processData;
							//step = 110000;
							//processData.prepare (*selectedComponent, 0, Steinberg::Vst::kSample32);
							//processData.numSamples = 0;
							//step = 120000;
							//result = selectedProcessor->process (processData);
							
							
							
							int samplingRate40k = 44000;
							int framePosition = 0;
							double const beatPerMinute = 120.0;
							double beatPerSecond = beatPerMinute / 60.0;
							Steinberg::Vst::ProcessContext vstProcessContext;// = {};
							vstProcessContext.sampleRate = samplingRate40k;
							vstProcessContext.projectTimeSamples = framePosition;
							vstProcessContext.projectTimeMusic = framePosition / 44100.0 * beatPerSecond;
							vstProcessContext.tempo = beatPerMinute;
							vstProcessContext.timeSigDenominator = 4;
							vstProcessContext.timeSigNumerator = 4;
							vstProcessContext.state =
							    Steinberg::Vst::ProcessContext::StatesAndFlags::kPlaying 
							    | Steinberg::Vst::ProcessContext::StatesAndFlags::kProjectTimeMusicValid 
							    | Steinberg::Vst::ProcessContext::StatesAndFlags::kTempoValid 
							    | Steinberg::Vst::ProcessContext::StatesAndFlags::kTimeSigValid;
							step = 110000;
							int durationInSamples = 64;
												
							int const waveSamplingRate = 44100;
							int const lengthInSamples = waveSamplingRate * 2;
							double const rad = 2 * 3.141592653589793;
							double const amp = 2 / 3.141592653589793 * 0.125;
							double const head_freq = 440;
							double const last_freq = 220;
							double const freq_angle = (last_freq - head_freq) / lengthInSamples;
							double current_freq = head_freq;
							double pos = 0;
							std::vector<double> wave_data_;							
							wave_data_.resize(lengthInSamples);
							for(int i = 0; i < lengthInSamples; ++i) {
								for(int k = 1; k <= 30; ++k) {
									wave_data_[i] += sin(rad * k * pos) / (double)(k);
								}
								wave_data_[i] *= amp;									
								double const progress = current_freq / waveSamplingRate;
								pos += progress;
								current_freq += freq_angle;
							}
							int wave_data_index_=0;		
							std::vector<Steinberg::Vst::AudioBusBuffers> inputs(input_buses_.GetBusCount());
							for(int i = 0; i < inputs.size(); ++i) {
								inputs[i].channelBuffers32 = input_buses_.GetBus(i).data();
								inputs[i].numChannels = input_buses_.GetBus(i).channels();
								inputs[i].silenceFlags = false;
								if(inputs[i].numChannels != 0) {
									for(int ch = 0; ch < inputs[i].numChannels; ++ch) {
										for(int smp = 0; smp < durationInSamples; ++smp) {
											inputs[i].channelBuffers32[ch][smp] = 
												wave_data_[(wave_data_index_ + smp) % (int)vstProcessContext.sampleRate];
										}
									}
									wave_data_index_ = (wave_data_index_ + durationInSamples) % (int)vstProcessContext.sampleRate;
								}
							}
							std::vector<Steinberg::Vst::AudioBusBuffers> outputs(output_buses_.GetBusCount());
							for(int i = 0; i < outputs.size(); ++i) {
								outputs[i].channelBuffers32 = output_buses_.GetBus(i).data();
								outputs[i].numChannels = output_buses_.GetBus(i).channels();
								outputs[i].silenceFlags = false;
							}
							struct Note
							{
								enum State {
									kNoteOn,
									kNoteOff
								};

								Note()
									: note_number_(-1)
									, note_state_(State::kNoteOff)
								{}

								int note_number_;
								State note_state_;
							};
							std::mutex note_mutex_;
							std::vector<Note> notes_;
							Steinberg::Vst::EventList input_event_list;
							Steinberg::Vst::EventList output_event_list;
							{
								//auto lock = std::unique_lock(note_mutex_);
								//std::unique_lock<std::mutex> lock1(from.m, std::defer_lock);
								for(auto &note: notes_) {
									Steinberg::Vst::Event e;
									e.busIndex = 0;
									e.sampleOffset = 0;
									e.ppqPosition = vstProcessContext.projectTimeMusic;
									e.flags = Steinberg::Vst::Event::kIsLive;
									if(note.note_state_ == Note::kNoteOn) {
										e.type = Steinberg::Vst::Event::kNoteOnEvent;
										e.noteOn.channel = 0;
										e.noteOn.length = 0;
										e.noteOn.pitch = note.note_number_;
										e.noteOn.tuning = 0;
										e.noteOn.noteId = -1;
										e.noteOn.velocity = 100 / 127.0;
									} else if(note.note_state_ == Note::kNoteOff) {
										e.type = Steinberg::Vst::Event::kNoteOffEvent;
										e.noteOff.channel = 0;
										e.noteOff.pitch = note.note_number_;
										e.noteOff.tuning = 0;
										e.noteOff.noteId = -1;
										e.noteOff.velocity = 100 / 127.0;
									} else {
										continue;
									}
									input_event_list.addEvent(e);
								}
								notes_.clear();
							}
							Steinberg::Vst::ParameterChanges input_changes_;
							Steinberg::Vst::ParameterChanges output_changes_;
							step = 120000;
							Steinberg::Vst::ProcessData process_data;
							process_data.processContext = &vstProcessContext;
							process_data.processMode = Steinberg::Vst::ProcessModes::kRealtime;
							process_data.symbolicSampleSize = Steinberg::Vst::SymbolicSampleSizes::kSample32;
							process_data.numSamples = durationInSamples;

							process_data.numInputs = inputs.size();
							process_data.numOutputs = outputs.size();
							process_data.inputs = inputs.data();
							process_data.outputs = outputs.data();
							process_data.inputEvents = &input_event_list;
							process_data.outputEvents = &output_event_list;
							process_data.inputParameterChanges = &input_changes_;
							process_data.outputParameterChanges = &output_changes_;

							step = 130000;
							result = selectedProcessor->process (process_data);

							step = 140000;
							selectedProcessor->setProcessing (false);
							step = 150000;
						}
					}
				}
			}
		}
		return step + result;
	}
	char const* VST3_description() {
		char buffer[999];
		snprintf(buffer, sizeof(buffer), "{\"vendor\":\"%s\", \"count\":\"%d\", \"email\":\"%s\", \"url\":\"%s\"}"
		         , pFactoryInfo.vendor, iPluginFactory->countClasses(), pFactoryInfo.email, pFactoryInfo.url);
		char const *p = buffer;
		return p;
	}
	char const* VST3_setInteger(char* name, int value) {
		char buffer[999];
		snprintf(buffer, sizeof(buffer), "Set integer %s: %d", name, value);
		char const *p = buffer;
		return p;
	}
	void VST3_process(float** inputBuffer,float** outputBuffer)
	//WAM::AudioBus* audio, void* data)
		{
			/*
			// mono 16-bit signed ints
			synth_unit_->GetSamples(bufsize_, outbuf16_);

			static const float scaler = 0.00003051757813;
			float* outbuf = audio->outputs[0];
			for (uint32_t n=0; n<bufsize_; n++)
				outbuf[n] = outbuf16_[n] * scaler;
			*/
		}
}


