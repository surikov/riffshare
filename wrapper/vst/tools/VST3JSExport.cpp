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
Steinberg::Vst::IEditController* selectedEditController;
Steinberg::FUnknown* localPluginContext = nullptr;
Steinberg::Vst::ProcessData process_data;
Steinberg::Vst::AudioBusBuffers inputsAudioBusBuffers;
Steinberg::Vst::AudioBusBuffers outAudioBusBuffers;
int durationInSamples = 128;
Steinberg::Vst::ParameterChanges inputParameterChanges;
Steinberg::Vst::ParameterChanges outParameterChanges;

char sb[999];

void browserLog(char const * txt) {
	snprintf(sb, sizeof(sb), "console.log(' - VST3JS %s');//", txt);
	emscripten_run_script(sb);
}
void browserLogInteger(char const * txt, int nn) {
	snprintf(sb, sizeof(sb), "console.log(' - VST3JS %s %d');//", txt, nn);
	emscripten_run_script(sb);
}
void browserLogFloat(char const * txt, float f) {
	snprintf(sb, sizeof(sb), "console.log(' - VST3JS %s %.9f');//", txt, f);
	emscripten_run_script(sb);
}
Steinberg::int32 createBuffers (Steinberg::Vst::IComponent& component, Steinberg::Vst::AudioBusBuffers*& buffers
                                , Steinberg::Vst::BusDirection dir, Steinberg::int32 bufferSamples, Steinberg::int32 symbolicSampleSize
                               ) {
	Steinberg::int32 busCount = component.getBusCount (Steinberg::Vst::kAudio, dir);
	if (busCount > 0) {
		buffers = new Steinberg::Vst::AudioBusBuffers[busCount];
		for (Steinberg::int32 i = 0; i < busCount; i++) {
			Steinberg::Vst::BusInfo busInfo = {0};
			int result = component.getBusInfo (Steinberg::Vst::kAudio, dir, i, busInfo);
			if (result == Steinberg::kResultTrue) {
				buffers[i].numChannels = busInfo.channelCount;
				if (busInfo.channelCount > 0) {
					if (symbolicSampleSize == Steinberg::Vst::kSample64) {
						buffers[i].channelBuffers64 = new Steinberg::Vst::Sample64*[busInfo.channelCount];
					}
					else {
						buffers[i].channelBuffers32 = new Steinberg::Vst::Sample32*[busInfo.channelCount];
					}
					for (Steinberg::int32 j = 0; j < busInfo.channelCount; j++) {
						if (symbolicSampleSize == Steinberg::Vst::kSample64) {
							if (bufferSamples > 0) {
								buffers[i].channelBuffers64[j] = new Steinberg::Vst::Sample64[bufferSamples];
							}
							else {
								buffers[i].channelBuffers64[j] = nullptr;
							}
						}
						else {
							if (bufferSamples > 0) {
								buffers[i].channelBuffers32[j] = new Steinberg::Vst::Sample32[bufferSamples];
							}
							else {
								buffers[i].channelBuffers32[j] = nullptr;
							}
						}
					}
				}
			}
		}
	}
	return busCount;
}

extern "C" {

	int VST3_init() {
		browserLog("VST3_init v1.0.2");
		iPluginFactory = GetPluginFactory();
		iPluginFactory->getFactoryInfo (&pFactoryInfo);
		Steinberg::FUnknownPtr<Steinberg::IPluginFactory2> pf2 = iPluginFactory;
		return -1;
	}
	char const* VST3_classInfo(int nn) {
		Steinberg::FUnknownPtr<Steinberg::IPluginFactory2> pf2 = iPluginFactory;
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
		         , title8
		         , shortTitle8
		         , units8
		         , parameterInfo.flags
		        );
		char const *p = buffer;
		return p;
	}
	int VST3_selectProcessor(int nn) {
		Steinberg::PClassInfo pClassInfo;
		iPluginFactory->getClassInfo (nn, &pClassInfo);
		int result = iPluginFactory->createInstance (pClassInfo.cid, Steinberg::Vst::IComponent::iid, (void**)&selectedComponent);
		if (result == Steinberg::kResultOk ) {
			result = selectedComponent->initialize (localPluginContext);
			if (selectedComponent->queryInterface (Steinberg::Vst::IEditController::iid, (void**)&selectedEditController) != Steinberg::kResultTrue)
			{
				Steinberg::TUID controllerCID;
				result = selectedComponent->getControllerClassId (controllerCID);
				if (result == Steinberg::kResultOk)
				{
					result = iPluginFactory->createInstance (controllerCID, Steinberg::Vst::IEditController::iid, (void**)&selectedEditController);
					if (selectedEditController && (result == Steinberg::kResultOk))
					{
						result = selectedEditController->initialize (localPluginContext);
						Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
						selectedProcessor = selectedComponent;
						if (!selectedProcessor) {
							return false;
						} else {
							Steinberg::Vst::ProcessSetup setup = {};
							setup.maxSamplesPerBlock = 2048;
							setup.sampleRate = 44100;
							setup.symbolicSampleSize = Steinberg::Vst::SymbolicSampleSizes::kSample32;
							setup.processMode = Steinberg::Vst::ProcessModes::kRealtime;
							result = selectedProcessor->setupProcessing(setup);

							Steinberg::Vst::AudioBusBuffers* iBuses = &inputsAudioBusBuffers;
							int coInputBusCount = createBuffers(*selectedComponent, iBuses, Steinberg::Vst::BusDirections::kInput, durationInSamples, Steinberg::Vst::kSample32);

							Steinberg::Vst::AudioBusBuffers* oBuses = &outAudioBusBuffers;
							int coOutBusCount = createBuffers(*selectedComponent, oBuses, Steinberg::Vst::BusDirections::kOutput, durationInSamples, Steinberg::Vst::kSample32);

							Steinberg::Vst::SpeakerArrangement* inSpeakerArrangement = nullptr;
							if (coInputBusCount > 0) {
								inSpeakerArrangement = new Steinberg::Vst::SpeakerArrangement[coInputBusCount];
								for (int i = 0; i < coInputBusCount; i++) {
									inSpeakerArrangement[i] = Steinberg::Vst::SpeakerArr::kStereo;
								}
							}
							Steinberg::Vst::SpeakerArrangement* outSpeakerArrangement = nullptr;
							if (coOutBusCount > 0) {
								outSpeakerArrangement = new Steinberg::Vst::SpeakerArrangement[coOutBusCount];
								for (int i = 0; i < coOutBusCount; i++) {
									outSpeakerArrangement[i] = Steinberg::Vst::SpeakerArr::kStereo;
								}
							}
							result = selectedProcessor->setBusArrangements(inSpeakerArrangement, coInputBusCount, outSpeakerArrangement, coOutBusCount);
							browserLogInteger("setBusArrangements", result);

							result = selectedProcessor->canProcessSampleSize(Steinberg::Vst::SymbolicSampleSizes::kSample32);
							browserLogInteger("canProcessSampleSize", result);

							int framePosition = 0;
							double const beatPerMinute = 120.0;
							double beatPerSecond = beatPerMinute / 60.0;

							Steinberg::Vst::ProcessContext vstProcessContext;
							vstProcessContext.sampleRate = setup.sampleRate;
							vstProcessContext.projectTimeSamples = framePosition;
							vstProcessContext.projectTimeMusic = framePosition / setup.sampleRate * beatPerSecond;
							vstProcessContext.tempo = beatPerMinute;
							vstProcessContext.timeSigDenominator = 4;
							vstProcessContext.timeSigNumerator = 4;
							vstProcessContext.state = Steinberg::Vst::ProcessContext::StatesAndFlags::kPlaying
							                          | Steinberg::Vst::ProcessContext::StatesAndFlags::kProjectTimeMusicValid
							                          | Steinberg::Vst::ProcessContext::StatesAndFlags::kTempoValid
							                          | Steinberg::Vst::ProcessContext::StatesAndFlags::kTimeSigValid;


							Steinberg::Vst::EventList input_event_list;
							Steinberg::Vst::EventList out_event_list;

							inputParameterChanges.clearQueue();
							outParameterChanges.clearQueue();

							process_data.processContext = &vstProcessContext;
							process_data.processMode = Steinberg::Vst::ProcessModes::kRealtime;
							process_data.symbolicSampleSize = Steinberg::Vst::SymbolicSampleSizes::kSample32;
							process_data.numSamples = durationInSamples;
							process_data.numInputs = coInputBusCount;
							process_data.numOutputs = coOutBusCount;
							process_data.inputs = &inputsAudioBusBuffers;
							process_data.outputs = &outAudioBusBuffers;
							process_data.inputEvents = &input_event_list;
							process_data.outputEvents = &out_event_list;
							process_data.inputParameterChanges = &inputParameterChanges;
							process_data.outputParameterChanges = &outParameterChanges;

							selectedComponent->setActive(true);
							selectedProcessor->setProcessing (true);

							browserLogInteger("input bus", process_data.numInputs);
							for (int i = 0; i < process_data.numInputs; i++) {
								Steinberg::Vst::BusInfo busInfo = {0};
								result = selectedComponent->getBusInfo (Steinberg::Vst::kAudio, Steinberg::Vst::BusDirections::kInput, i, busInfo);
								int numChannels = busInfo.channelCount;
								browserLogInteger("input channel", numChannels);
								for (int c = 0; c < numChannels; c++) {
									float* channel = process_data.inputs[i].channelBuffers32[c];
									for (int n = 0; n < process_data.numSamples; n++) {
										channel[n] = 0.0;
									}
								}
							}
							browserLogInteger("output bus", process_data.numOutputs);
							for (int i = 0; i < process_data.numOutputs; i++) {
								Steinberg::Vst::BusInfo busInfo = {0};
								result = selectedComponent->getBusInfo (Steinberg::Vst::kAudio, Steinberg::Vst::BusDirections::kOutput, i, busInfo);
								int numChannels = busInfo.channelCount;
								browserLogInteger("output channel", numChannels);
								for (int c = 0; c < numChannels; c++) {
									float* channel = process_data.outputs[i].channelBuffers32[c];
									for (int n = 0; n < process_data.numSamples; n++) {
										channel[n] = 0.0;
									}
								}
							}
							browserLog("VST3_processor ready");
						}
					}
				}
			}
		}

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
	int VST3_process(const float* inputBuffer, const float* outputBuffer, int len)
	{
		browserLog("start VST3_process");
		//browserLogInteger("inputBuffer",sizeof(*inputBuffer));
		//browserLogFloat("0", inputBuffer[0]);
		//browserLogFloat("1", inputBuffer[1]);
		//browserLogFloat("2", inputBuffer[2]);
		//browserLogFloat("127", inputBuffer[127]);
		for (int i = 0; i < 3; i++) {
			for (int n = 0; n < process_data.numSamples; n++) {
				browserLogInteger("i", i);	
				browserLogInteger("n", n);			
				float fff=inputBuffer[n];
				browserLogFloat("fff", fff);
			}
		}

		int r = -1;
		Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
		browserLog("input copy");
		for (int i = 0; i < process_data.numInputs; i++) {
			browserLogInteger("input bus", i);
			Steinberg::Vst::BusInfo busInfo = {0};
			int result = selectedComponent->getBusInfo (Steinberg::Vst::kAudio, Steinberg::Vst::BusDirections::kInput, i, busInfo);
			int numChannels = busInfo.channelCount;
			browserLogInteger("numChannels", numChannels);
			for (int c = 0; c < numChannels; c++) {
				browserLogInteger("input channel", c);
				float* channel = process_data.inputs[i].channelBuffers32[c];
				browserLogInteger("numSamples", process_data.numSamples);
				for (int n = 0; n < process_data.numSamples; n++) {
					browserLogInteger("n", n);
					browserLogFloat("nth", inputBuffer[n]);
					float fff=inputBuffer[n];
					browserLogFloat("to", channel[n]);
					channel[n] = fff;//inputBuffer[n];
					browserLogFloat("check", channel[n]);
				}
			}
		}
		browserLog("clear output");
		for (int i = 0; i < process_data.numOutputs; i++) {
			//browserLogInteger("output bus", i);
			Steinberg::Vst::BusInfo busInfo = {0};
			int result = selectedComponent->getBusInfo (Steinberg::Vst::kAudio, Steinberg::Vst::BusDirections::kOutput, i, busInfo);
			int numChannels = busInfo.channelCount;
			//browserLogInteger("numChannels", numChannels);
			for (int c = 0; c < numChannels; c++) {
				//browserLogInteger("channel", c);
				float* channel = process_data.outputs[i].channelBuffers32[c];
				for (int n = 0; n < process_data.numSamples; n++) {
					//browserLogInteger("n", n);
					//browserLogFloat("nth", inputBuffer[n]);
					channel[n] = 0.0;
				}
			}
		}
		//browserLog("VST3_process 1");

		//browserLog("VST3_process 2");
		//selectedProcessor = selectedComponent;
		browserLog("->process");
		r = selectedProcessor->process (process_data);
		//outputBuffer[0] = -1;
		//outputBuffer[3] = process_data.processMode;
		//outputBuffer[4] = 0.7;
		//outputBuffer[5] = 70.7;
		browserLog("done VST3_process");
		return r;
	}
}

