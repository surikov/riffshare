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


extern "C" {

	int VST3_init() {
		browserLog("VST3_init v1.0.1");
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

							browserLogInteger("setupProcessing", result);

							int coInputBusCount = selectedComponent->getBusCount(Steinberg::Vst::MediaTypes::kAudio, Steinberg::Vst::BusDirections::kInput);
							browserLogInteger("coInputBusCount", coInputBusCount);
							Steinberg::Vst::SpeakerArrangement* setInputs = nullptr;
							if (coInputBusCount > 0) {
								inputsAudioBusBuffers.channelBuffers32 = new Steinberg::Vst::Sample32*[coInputBusCount];
								setInputs = new Steinberg::Vst::SpeakerArrangement[coInputBusCount];
								for (int i = 0; i < coInputBusCount; i++) {
									Steinberg::Vst::SpeakerArrangement speakerArrangement;
									result = selectedProcessor->getBusArrangement (Steinberg::Vst::BusDirections::kInput, i, speakerArrangement);
									browserLogInteger("in speakerArrangement", speakerArrangement);
									setInputs[i] = speakerArrangement;
									Steinberg::Vst::BusInfo busInfo;
									result = selectedComponent->getBusInfo(Steinberg::Vst::MediaTypes::kAudio, Steinberg::Vst::BusDirections::kInput, i, busInfo);
									browserLogInteger("in channels", busInfo.channelCount);
									Steinberg::Vst::Sample32 *ichan = new Steinberg::Vst::Sample32[busInfo.channelCount];
									inputsAudioBusBuffers.channelBuffers32[i] = ichan;
									for (int n = 0; n < busInfo.channelCount; n++) {
										Steinberg::Vst::Sample32 *ibuff = new Steinberg::Vst::Sample32[durationInSamples];
										ichan[n] = *ibuff;
										browserLogInteger("in chan", n);
									}
								}
							}
							int coOutBusCount = selectedComponent->getBusCount(Steinberg::Vst::MediaTypes::kAudio, Steinberg::Vst::BusDirections::kOutput);
							browserLogInteger("coOutBusCount", coOutBusCount);
							Steinberg::Vst::SpeakerArrangement* setOutputs = nullptr;
							if (coOutBusCount > 0) {
								outAudioBusBuffers.channelBuffers32 = new Steinberg::Vst::Sample32*[coOutBusCount];
								setOutputs = new Steinberg::Vst::SpeakerArrangement[coOutBusCount];
								for (int i = 0; i < coOutBusCount; i++) {
									Steinberg::Vst::SpeakerArrangement speakerArrangement;
									result = selectedProcessor->getBusArrangement (Steinberg::Vst::BusDirections::kOutput, i, speakerArrangement);
									browserLogInteger("out speakerArrangement", speakerArrangement);
									setOutputs[i] = speakerArrangement;
									Steinberg::Vst::BusInfo busInfo;
									result = selectedComponent->getBusInfo(Steinberg::Vst::MediaTypes::kAudio, Steinberg::Vst::BusDirections::kOutput, i, busInfo);
									browserLogInteger("out channels", busInfo.channelCount);
									Steinberg::Vst::Sample32 *ochan = new Steinberg::Vst::Sample32[busInfo.channelCount];
									outAudioBusBuffers.channelBuffers32[i] = ochan;
									for (int n = 0; n < busInfo.channelCount; n++) {
										Steinberg::Vst::Sample32 *obuff = new Steinberg::Vst::Sample32[durationInSamples];
										ochan[n] = *obuff;
										browserLogInteger("out chan", n);
									}
								}
							}

							result = selectedProcessor->setBusArrangements(setInputs, coInputBusCount, setOutputs, coOutBusCount);
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
						}
					}
				}
			}
		}
		browserLog("VST3_processor ready");
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
		browserLog("VST3_process start");
		int r = -1;
		Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
		browserLog("copy input");
		for (int i = 0; i < process_data.numInputs; i++) {
			Steinberg::Vst::SpeakerArrangement speakerArrangement;
			selectedProcessor->getBusArrangement (Steinberg::Vst::BusDirections::kInput, i, speakerArrangement);
			int numChannels = Steinberg::Vst::SpeakerArr::getChannelCount (speakerArrangement);
			for (int c = 0; c < numChannels; c++) {
				for (int n = 0; n < process_data.numSamples; n++) {
					process_data.inputs[i].channelBuffers32[c][n] = inputBuffer[n];
				}
			}
		}
		browserLog("clear output");
		for (int i = 0; i < process_data.numOutputs; i++) {
			browserLog("n1");
			Steinberg::Vst::SpeakerArrangement speakerArrangement;
			selectedProcessor->getBusArrangement (Steinberg::Vst::BusDirections::kOutput, i, speakerArrangement);
			int numChannels = Steinberg::Vst::SpeakerArr::getChannelCount (speakerArrangement);
			browserLog("n2");
			for (int c = 0; c < numChannels; c++) {
				browserLog("n3");
				for (int n = 0; n < process_data.numSamples; n++) {
					browserLog("n4");
					process_data.outputs[i].channelBuffers32[c][n] = 0;
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
		browserLog("VST3_process done=======================================================");
		return r;
	}
}

