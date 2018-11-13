#include <stdio.h>
#include "pluginterfaces/base/ftypes.h"
#include "pluginterfaces/base/funknown.h"
#include "public.sdk/source/vst/vstaudioeffect.h"
#include "pluginterfaces/base/iupdatehandler.h"
#include "pluginterfaces/base/icloneable.h"
#include "pluginterfaces/base/ibstream.h"
#include "pluginterfaces/base/ipluginbase.h"
#include "base/source/fstring.h"
#include "pluginterfaces/vst/ivstcomponent.h"
#include "pluginterfaces/vst/ivstaudioprocessor.h"
#include "pluginterfaces/vst/ivsthostapplication.h"
#include "pluginterfaces/vst/ivsteditcontroller.h"
#include "pluginterfaces/vst/ivstunits.h"
#include "pluginterfaces/test/itest.h"
#include <string>
#include <sstream>
#include "pluginterfaces/base/ustring.h"
#include "public.sdk/source/vst/hosting/processdata.h"
#include "pluginterfaces/base/ftypes.h"
#include "pluginterfaces/vst/ivstprocesscontext.h"

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

	Buffer(size_t num_channels, size_t num_samples)
	{
		resize(num_channels, num_samples);
	}

	size_t samples() const { return sample_; }
	size_t channels() const { return channel_; }

	value_type ** data() { return buffer_heads_.data(); }
	value_type const * const * data() const { return buffer_heads_.data(); }

	void resize(size_t num_channels, size_t num_samples)
	{
		std::vector<value_type> tmp(num_channels * num_samples);
		std::vector<value_type *> tmp_heads(num_channels);

		channel_ = num_channels;
		sample_ = num_samples;

		buffer_.swap(tmp);
		buffer_heads_.swap(tmp_heads);
		for (size_t i = 0; i < num_channels; ++i) {
			buffer_heads_[i] = buffer_.data() + (i * num_samples);
		}
	}

	void resize_samples(size_t num_samples)
	{
		resize(channels(), num_samples);
	}

	void resize_channels(size_t num_channels)
	{
		resize(num_channels, samples());
	}

public:
	std::vector<value_type> buffer_;
	std::vector<value_type *> buffer_heads_;

	size_t channel_;
	size_t sample_;
};

struct AudioBus
{
	typedef Buffer<float> buffer_type;

	AudioBus()
		:	speaker_arrangement_(Steinberg::Vst::SpeakerArr::kEmpty)
	{}

	void SetBlockSize(size_t num_samples)
	{
		buffer_.resize_samples(num_samples);
	}

	void SetChannels(size_t num_channels, Steinberg::Vst::SpeakerArrangement speaker_arrangement)
	{
		buffer_.resize_channels(num_channels);
		speaker_arrangement_ = speaker_arrangement;
	}

	size_t channels() const
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

	size_t GetBusCount() const
	{
		return buses_.size();
	}

	void SetBusCount(size_t n)
	{
		buses_.resize(n);
	}

	size_t GetBlockSize() const
	{
		return block_size_;
	}

	void SetBlockSize(size_t num_samples)
	{
		for (auto &bus : buses_) {
			bus.SetBlockSize(num_samples);
		}
		block_size_ = num_samples;
	}

	AudioBus & GetBus(size_t index)
	{
		return buses_[index];
	}

	AudioBus const & GetBus(size_t index) const
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
			for (size_t i = 0; i < bus.channels(); ++i) {
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

	size_t GetTotalChannels() const
	{
		return heads_.size();
	}

private:
	size_t block_size_;
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
							int sampling_rate_ = 44000;
							size_t frame_pos = 0;
							double const tempo = 120.0;
							double beat_per_second = tempo / 60.0;
							Steinberg::Vst::ProcessContext process_context;// = {};
							process_context.sampleRate = sampling_rate_;
							process_context.projectTimeSamples = frame_pos;
							process_context.projectTimeMusic = frame_pos / 44100.0 * beat_per_second;
							process_context.tempo = tempo;
							process_context.timeSigDenominator = 4;
							process_context.timeSigNumerator = 4;
							process_context.state =
							    Steinberg::Vst::ProcessContext::StatesAndFlags::kPlaying |
							    Steinberg::Vst::ProcessContext::StatesAndFlags::kProjectTimeMusicValid |
							    Steinberg::Vst::ProcessContext::StatesAndFlags::kTempoValid |
							    Steinberg::Vst::ProcessContext::StatesAndFlags::kTimeSigValid;
							step = 110000;
							size_t duration = 64;
							std::vector<Steinberg::Vst::AudioBusBuffers> inputs(input_buses_.GetBusCount());
							step = 120000;
							Steinberg::Vst::ProcessData process_data;
							process_data.processContext = &process_context;
							process_data.processMode = Steinberg::Vst::ProcessModes::kRealtime;
							process_data.symbolicSampleSize = Steinberg::Vst::SymbolicSampleSizes::kSample32;
							process_data.numSamples = duration;

							process_data.numInputs = inputs.size();
							process_data.numOutputs = outputs.size();
							process_data.inputs = inputs.data();
							process_data.outputs = outputs.data();
							process_data.inputEvents = &input_event_list;
							process_data.outputEvents = &output_event_list;
							process_data.inputParameterChanges = &input_changes_;
							process_data.outputParameterChanges = &output_changes_;










							step = 130000;
							selectedProcessor->setProcessing (false);
							step = 140000;
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
}


