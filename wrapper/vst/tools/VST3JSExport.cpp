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
#include "pluginterfaces/base/fplatform.h"

#include "pluginterfaces/vst/ivstcomponent.h"
#include "pluginterfaces/vst/ivstaudioprocessor.h"
#include "pluginterfaces/vst/ivsthostapplication.h"
#include "pluginterfaces/vst/ivsteditcontroller.h"
#include "pluginterfaces/vst/ivstunits.h"
#include "pluginterfaces/vst/ivstprocesscontext.h"

#include "pluginterfaces/test/itest.h"

#include <emscripten.h>

Steinberg::IPluginFactory* iPluginFactory;
Steinberg::PFactoryInfo pFactoryInfo;
Steinberg::Vst::IComponent* selectedComponent;
//Steinberg::Vst::IAudioProcessor* selectedProcessor;
Steinberg::Vst::IEditController* selectedEditController;
Steinberg::FUnknown* localPluginContext = nullptr;
//Steinberg::Vst::ProcessData process_data;
//Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor;

template < class T >
    struct ChannelSamplesBuffer {
        typedef T sampleValueType;
        ChannelSamplesBuffer(): channelsCount(0), samplesCount(0) {
			//
		}
        ChannelSamplesBuffer(int num_channels, int num_samples) {
            resize(num_channels, num_samples);
        }
        int samples() const {
            return samplesCount;
        }
        int channels() const {
            return channelsCount;
        }
        sampleValueType ** raw() {
            return bufferHeads.data();
        }
        sampleValueType const * const * raw() const {
            return bufferHeads.data();
        }
        void resize(int num_channels, int num_samples) {
			channelsCount = num_channels;
            samplesCount = num_samples;
            std::vector < sampleValueType > tmp(channelsCount * samplesCount);
            std::vector < sampleValueType * > tmp_heads(channelsCount);            
            samplesVector.swap(tmp);
            bufferHeads.swap(tmp_heads);
            for (int i = 0; i < channelsCount; i++) {
                bufferHeads[i] = samplesVector.data() + (i * num_samples);
            }
        }
        void resizeSamples(int num_samples) {
            resize(channels(), num_samples);
        }
        void resizeChannels(int num_channels) {
            resize(num_channels, samples());
        }
        public:
            std::vector < sampleValueType > samplesVector;
			std::vector < sampleValueType * > bufferHeads;
			int channelsCount;
			int samplesCount;
    };
struct AudioBus {
    typedef ChannelSamplesBuffer < float > bufferSampleType;
    AudioBus(): vstSpeakerArr(Steinberg::Vst::SpeakerArr::kEmpty) {
        //
    }
    void SetBlockSize(int num_samples) {
        channelsBuffer.resizeSamples(num_samples);
    }
    void SetChannels(int num_channels, Steinberg::Vst::SpeakerArrangement speaker_arrangement) {
        channelsBuffer.resizeChannels(num_channels);
        vstSpeakerArr = speaker_arrangement;
    }
    int channels() const {
        return channelsBuffer.channels();
    }
    float ** raw() {
        return channelsBuffer.raw();
    }
    float    const *    const * raw() const {
        return channelsBuffer.raw();
    }
    Steinberg::Vst::SpeakerArrangement GetSpeakerArrangement() const {
        return vstSpeakerArr;
    }
    private:
        bufferSampleType channelsBuffer;
		Steinberg::uint64 vstSpeakerArr;
};

struct AudioBuses {
    AudioBuses(): block_size_(0) {
        //
    }
    AudioBuses(AudioBuses && rhs): audioBusList(std::move(rhs.audioBusList)), block_size_(rhs.block_size_) {
        //
    }
    AudioBuses & operator = (AudioBuses && rhs) {
        audioBusList = std::move(rhs.audioBusList);
        block_size_ = rhs.block_size_;
        rhs.block_size_ = 0;
        return *this;
    }
    int GetBusCount() const {
        return audioBusList.size();
    }
    void SetBusCount(int n) {
        audioBusList.resize(n);
    }
    int GetBlockSize() const {
        return block_size_;
    }
    void SetBlockSize(int num_samples) {
        for (auto & bus: audioBusList) {
            bus.SetBlockSize(num_samples);
        }
        block_size_ = num_samples;
    }
    AudioBus & GetBus(int index) {
        return audioBusList[index];
    }
    AudioBus    const & GetBus(int index) const {
        return audioBusList[index];
    }
    void UpdateBufferHeads() {
        int n = 0;
        for (auto
            const & bus: audioBusList) {
            n += bus.channels();
        }
        std::vector < float * > tmp_heads(n);
        n = 0;
        for (auto & bus: audioBusList) {
            for (int i = 0; i < bus.channels(); ++i) {
                tmp_heads[n] = bus.raw()[i];
                n++;
            }
        }
        headsList = std::move(tmp_heads);
    }
    float ** raw() {
        return headsList.data();
    }
    float    const *    const * raw() const {
        return headsList.data();
    }
    int GetTotalChannels() const {
        return headsList.size();
    }
    private:
        int block_size_;
		std::vector < AudioBus > audioBusList;
		std::vector < float * > headsList;
};


AudioBuses outputAudioBuses;
AudioBuses inputAudioBuses;
Steinberg::Vst::ProcessContext createVSTContext(int samplingRate40k,int framePosition,double beatPerSecond,double beatPerMinute){
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
	return vstProcessContext;
}
extern "C" {

	int VST3_init() {
		emscripten_run_script("console.log('VST3_init v1.0.1')");
		iPluginFactory = GetPluginFactory();
		iPluginFactory->getFactoryInfo (&pFactoryInfo);
		
		
		

		Steinberg::FUnknownPtr<Steinberg::IPluginFactory2> pf2=iPluginFactory;
		
		return -1;
	}
	char const* VST3_classInfo(int nn) {
		//Steinberg::PClassInfo pClassInfo;
		//Steinberg::PClassInfo2 pClassInfo2;
		//iPluginFactory->getClassInfo (nn, &pClassInfo);
		//Steinberg::FUnknownPtr<Steinberg::PClassInfo2> pClassInfo2 (pClassInfo);
		//pClassInfo2=owned(pClassInfo);
		Steinberg::FUnknownPtr<Steinberg::IPluginFactory2> pf2=iPluginFactory;
		Steinberg::PClassInfo2 pClassInfo;
		pf2->getClassInfo2 (nn, &pClassInfo);
		
		
		char buffer[999];
		Steinberg::FUID fuid = Steinberg::FUID::fromTUID(pClassInfo.cid);
		Steinberg::char8 strUID[33] = {0};
		fuid.toString (strUID);
		snprintf(buffer, sizeof(buffer)
		         , "{\"name\":\"%s\", \"category\":\"%s\", \"subcategory\":\"%s\", \"version\":\"%s\"  , \"cid\":\"%s\"}"
		         , pClassInfo.name
		         , pClassInfo.category
				 , pClassInfo.subCategories
				 , pClassInfo.version
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
		//int step = 10000;
		int result = iPluginFactory->createInstance (pClassInfo.cid, Steinberg::Vst::IComponent::iid, (void**)&selectedComponent);
		if (result == Steinberg::kResultOk ) {
			//step = 20000;
			result = selectedComponent->initialize (localPluginContext);
			//step = 30000;
			if (selectedComponent->queryInterface (Steinberg::Vst::IEditController::iid, (void**)&selectedEditController) != Steinberg::kResultTrue)
			{
				//step = 40000;
				Steinberg::TUID controllerCID;
				result = selectedComponent->getControllerClassId (controllerCID);
				if (result == Steinberg::kResultOk)
				{
					//step = 50000;
					result = iPluginFactory->createInstance (controllerCID, Steinberg::Vst::IEditController::iid, (void**)&selectedEditController);
					if (selectedEditController && (result == Steinberg::kResultOk))
					{
						//step = 60000;
						result = selectedEditController->initialize (localPluginContext);
						//step = 70000;
						//Steinberg::Vst::IAudioProcessor* selectedProcessor;
						Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
						//selectedProcessor = owned(selectedComponent);
						
						selectedProcessor = selectedComponent;
						if (!selectedProcessor) {
							return false;
						} else {
							selectedProcessor->setProcessing (true);
							if(1==2){
							
							
							//step = 80000;
							result = selectedProcessor->getLatencySamples();
							//step = 90000;
							selectedProcessor->setProcessing (true);
							//step = 100000;
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
							Steinberg::Vst::ProcessContext vstProcessContext=createVSTContext(samplingRate40k,framePosition,beatPerSecond,beatPerMinute);
							/*
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
							*/
							//step = 110000;
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
							std::vector<double> samplesVector;
							samplesVector.resize(lengthInSamples);
							for (int i = 0; i < lengthInSamples; ++i) {
								for (int k = 1; k <= 30; ++k) {
									samplesVector[i] += sin(rad * k * pos) / (double)(k);
								}
								samplesVector[i] *= amp;
								double const progress = current_freq / waveSamplingRate;
								pos += progress;
								current_freq += freq_angle;
							}
							int samplesVectorCounter = 0;
							std::vector<Steinberg::Vst::AudioBusBuffers> inputs(inputAudioBuses.GetBusCount());
							for (int i = 0; i < inputs.size(); ++i) {
								inputs[i].channelBuffers32 = inputAudioBuses.GetBus(i).raw();
								inputs[i].numChannels = inputAudioBuses.GetBus(i).channels();
								inputs[i].silenceFlags = false;
								if (inputs[i].numChannels != 0) {
									for (int ch = 0; ch < inputs[i].numChannels; ++ch) {
										for (int smp = 0; smp < durationInSamples; ++smp) {
											inputs[i].channelBuffers32[ch][smp] =
											    samplesVector[(samplesVectorCounter + smp) % (int)vstProcessContext.sampleRate];
										}
									}
									samplesVectorCounter = (samplesVectorCounter + durationInSamples) % (int)vstProcessContext.sampleRate;
								}
							}
							std::vector<Steinberg::Vst::AudioBusBuffers> outputs(outputAudioBuses.GetBusCount());
							for (int i = 0; i < outputs.size(); ++i) {
								outputs[i].channelBuffers32 = outputAudioBuses.GetBus(i).raw();
								outputs[i].numChannels = outputAudioBuses.GetBus(i).channels();
								outputs[i].silenceFlags = false;
							}
							/*struct Note
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
							};*/
							//std::mutex note_mutex_;
							//std::vector<Note> notes_;
							Steinberg::Vst::EventList input_event_list;
							Steinberg::Vst::EventList output_event_list;
							/*{
								//auto lock = std::unique_lock(note_mutex_);
								//std::unique_lock<std::mutex> lock1(from.m, std::defer_lock);
								for (auto &note : notes_) {
									Steinberg::Vst::Event e;
									e.busIndex = 0;
									e.sampleOffset = 0;
									e.ppqPosition = vstProcessContext.projectTimeMusic;
									e.flags = Steinberg::Vst::Event::kIsLive;
									if (note.note_state_ == Note::kNoteOn) {
										e.type = Steinberg::Vst::Event::kNoteOnEvent;
										e.noteOn.channel = 0;
										e.noteOn.length = 0;
										e.noteOn.pitch = note.note_number_;
										e.noteOn.tuning = 0;
										e.noteOn.noteId = -1;
										e.noteOn.velocity = 100 / 127.0;
									} else if (note.note_state_ == Note::kNoteOff) {
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
							}*/
							Steinberg::Vst::ParameterChanges input_changes_;
							Steinberg::Vst::ParameterChanges output_changes_;
							//step = 120000;
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

							//step = 130000;
							result = selectedProcessor->process (process_data);

							//step = 140000;
							//selectedProcessor->setProcessing (false);
							//step = 150000;
							
							//selectedProcessor->setProcessing (false);
							//result = selectedProcessor->process (process_data);
							//selectedProcessor->setProcessing (false);
							//step = 150000;
						}
						}
					}
				}
			}
		}
		emscripten_run_script("console.log('VST3_processor ready')");
		return result;
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
	int waveCounter = 0;
	int waveLen = 111;
	float waveSample = 0.155;
	int VST3_process(float* inputBuffer, float* outputBuffer, int len)
	{
		//emscripten_run_script("console.log('VST3_process -------------------------------------------------------')");
		/*
		for (int i = 0; i < len; i++) {
			outputBuffer[i] = inputBuffer[i]+waveSample;
			waveCounter++;
			if (waveCounter >= waveLen) {
				waveCounter = 0;
				waveSample = -waveSample;
			}
		}
		outputBuffer[13] = 111;
		outputBuffer[14] = 222;
		inputBuffer[15] = 222;
		*/
		int r=-1;
		//int nn=-1;
		//try{
			Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
			int samplingRate40k = 44000;
			int framePosition = 0;
			double const beatPerMinute = 120.0;
			double beatPerSecond = beatPerMinute / 60.0;
			Steinberg::Vst::ProcessContext vstProcessContext=createVSTContext(samplingRate40k,framePosition,beatPerSecond,beatPerMinute);
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
			std::vector<double> samplesVector;
			samplesVector.resize(lengthInSamples);
			for (int i = 0; i < lengthInSamples; ++i) {
				for (int k = 1; k <= 30; ++k) {
					samplesVector[i] += sin(rad * k * pos) / (double)(k);
				}
				samplesVector[i] *= amp;
				double const progress = current_freq / waveSamplingRate;
				pos += progress;
				current_freq += freq_angle;
			}
			int samplesVectorCounter = 0;
			std::vector<Steinberg::Vst::AudioBusBuffers> inputs(inputAudioBuses.GetBusCount());
			for (int i = 0; i < inputs.size(); ++i) {
				inputs[i].channelBuffers32 = inputAudioBuses.GetBus(i).raw();
				inputs[i].numChannels = inputAudioBuses.GetBus(i).channels();
				inputs[i].silenceFlags = false;
				if (inputs[i].numChannels != 0) {
					for (int ch = 0; ch < inputs[i].numChannels; ++ch) {
						for (int smp = 0; smp < durationInSamples; ++smp) {
							inputs[i].channelBuffers32[ch][smp] =
								samplesVector[(samplesVectorCounter + smp) % (int)vstProcessContext.sampleRate];
						}
					}
					samplesVectorCounter = (samplesVectorCounter + durationInSamples) % (int)vstProcessContext.sampleRate;
				}
			}
			std::vector<Steinberg::Vst::AudioBusBuffers> outputs(outputAudioBuses.GetBusCount());
			for (int i = 0; i < outputs.size(); ++i) {
				outputs[i].channelBuffers32 = outputAudioBuses.GetBus(i).raw();
				outputs[i].numChannels = outputAudioBuses.GetBus(i).channels();
				outputs[i].silenceFlags = false;
			}
			Steinberg::Vst::EventList input_event_list;
			Steinberg::Vst::EventList output_event_list;
			//emscripten_run_script("console.log('selectedProcessor->process ready')");
			//r=selectedProcessor->getLatencySamples();
			//Steinberg::Vst::ProcessData process_data;
			
			Steinberg::Vst::ParameterChanges inputParameterChanges;
			Steinberg::Vst::ParameterChanges outputParameterChanges;
			//step = 120000;
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
			process_data.inputParameterChanges = &inputParameterChanges;
			process_data.outputParameterChanges = &outputParameterChanges;

			//step = 130000;
			r = selectedProcessor->process (process_data);
			outputBuffer[0] = -1;
			outputBuffer[1] = inputs.size();
			outputBuffer[2] = outputs.size();
			outputBuffer[3] = process_data.processMode;
			outputBuffer[4] = 0.7;
			outputBuffer[5] = 70.7;
			//nn=1;
			//selectedProcessor->setProcessing (true);
			//nn=2;
			//emscripten_run_script("console.log('selectedProcessor->process start')");
			//selectedProcessor->process (process_data);
			//emscripten_run_script("console.log('selectedProcessor->process done')");
			//nn=3;
			//selectedProcessor->setProcessing (false);
			//nn=4;
			//outputBuffer[2] = process_data.numSamples;
			//nn=5;
			//outputBuffer[3] = process_data.symbolicSampleSize;
			//nn=6;
			//outputBuffer[4] = process_data.numInputs;
			//nn=7;
			//outputBuffer[5] = process_data.numOutputs;
			//nn=8;
		//}catch(...){
		//	outputBuffer[0] = -1;
		//}
		//outputBuffer[1] = nn;
		//emscripten_run_script("console.log('VST3_process done=======================================================')");
		return r;
	}
}

