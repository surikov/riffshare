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

int durationInSamples = 8;
int sampleRate = 16000;
Steinberg::Vst::ParameterChanges inputParameterChanges;
Steinberg::Vst::ParameterChanges outParameterChanges;

Steinberg::Vst::EventList inputEventList;
Steinberg::Vst::EventList outEventList;

Steinberg::Vst::ParameterInfo parameterInfo;


char sb[999];

void browserLogInteger(char const * txt, int nn) {
	snprintf(sb, sizeof(sb), "console.log(' - VST3JS - %s: %d');//", txt, nn);
	emscripten_run_script(sb);
}
void browserLogFloat(char const * txt, float f) {
	snprintf(sb, sizeof(sb), "console.log(' - VST3JS - %s: %.9f');//", txt, f);
	emscripten_run_script(sb);
}
class SilentComponentHandler: public Steinberg::FObject, public Steinberg::Vst::IComponentHandler {
	public:
		//int test=1;
	Steinberg::tresult beginEdit (Steinberg::Vst::ParamID tag)	override {
		return true;
	}
	Steinberg::tresult performEdit	(	Steinberg::Vst::ParamID 	id,		Steinberg::Vst::ParamValue 	valueNormalized 		)override	{
		return true;
	}
	Steinberg::tresult endEdit	(	Steinberg::Vst::ParamID 	id	)	override{
		return true;
	}
	Steinberg::tresult restartComponent	(	int 	flags	)override	{
		return true;
	}
	OBJ_METHODS (SilentComponentHandler, Steinberg::FObject)
	DEFINE_INTERFACES
		DEF_INTERFACE (Steinberg::Vst::IComponentHandler)
	END_DEFINE_INTERFACES (Steinberg::FObject)
	REFCOUNT_METHODS(Steinberg::FObject)
};

SilentComponentHandler * silentComponentHandler;

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

	int VST3_init(int bufferSize, int sampleRatio) {
		browserLogInteger("version v1.0.2", bufferSize);
		durationInSamples = bufferSize;
		sampleRate = sampleRatio;
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
	void VST3_setParameter(int id, float value) {
		browserLogInteger("set", id);
		browserLogFloat("to", value);

		/*
		Steinberg::Vst::IParamValueQueue* queue = 0;
		int parameterIndex=0;
		queue = inputParameterChanges.addParameterData(id, parameterIndex);
		int pointIndex=0;
		int sampleOffset=0;
		queue->addPoint (sampleOffset, value, pointIndex);
		*/
		selectedEditController->setParamNormalized(id, value);

		browserLogFloat("plain", selectedEditController->normalizedParamToPlain(id, value));
		browserLogFloat("normalized", selectedEditController->plainParamToNormalized(id, value));
		//selectedComponent->setActive(false);
		//selectedComponent->setActive(true);
	}
	float VST3_getParameter(int id) {
		double value = selectedEditController->getParamNormalized(id);
		return value;
	}
	void VST3_sendNoteOn(int key, float duration, double velocity, int id) {
		//browserLogInteger("add on event to",inputEventList.getEventCount());
		Steinberg::Vst::Event e;
		e.busIndex = 0;
		e.sampleOffset = 0;
		e.ppqPosition = 0;//process_context.projectTimeMusic;
		e.flags = Steinberg::Vst::Event::kIsLive;
		e.type = Steinberg::Vst::Event::kNoteOnEvent;
		e.noteOn.channel = 0;
		e.noteOn.length = duration * sampleRate;
		e.noteOn.pitch = key;
		e.noteOn.tuning = 0;
		e.noteOn.noteId = id;//-1;
		e.noteOn.velocity = velocity; //100 / 127.0;
		inputEventList.addEvent(e);
	}
	void VST3_sendNoteOff(int key, double velocity, int id) {
		//browserLogInteger("add off event to",inputEventList.getEventCount());
		Steinberg::Vst::Event e;
		e.busIndex = 0;
		e.sampleOffset = 0;
		e.ppqPosition = 0;//process_context.projectTimeMusic;
		e.flags = Steinberg::Vst::Event::kIsLive;
		e.type = Steinberg::Vst::Event::kNoteOffEvent;
		e.noteOff.channel = 0;
		//e.noteOn.length = duration*sampleRate;
		e.noteOff.pitch = key;
		e.noteOff.tuning = 0;
		e.noteOff.noteId = id;//-1;
		e.noteOff.velocity = velocity; //100 / 127.0;
		inputEventList.addEvent(e);
	}
	char const* VST3_parameterInfo(int nn) {
		char buffer[999];

		selectedEditController->getParameterInfo (nn, parameterInfo);
		selectedEditController->setComponentHandler(nullptr);

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
		         , "{\"nn\":\"%d\", \"title\":\"%s\", \"shortTitle\":\"%s\", \"units\":\"%s\", \"flags\":\"%d\", \"id\":\"%d\", \"stepCount\":\"%d\", \"defaultNormalizedValue\":\"%f\"}"
		         , nn
		         , title8
		         , shortTitle8
		         , units8
		         , parameterInfo.flags
		         , parameterInfo.id
		         , parameterInfo.stepCount
		         , parameterInfo.defaultNormalizedValue
		        );
		char const *p = buffer;
		return p;
	}
	int VST3_selectProcessor(int nn) {
		browserLogInteger("select processor from class", nn);
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
						silentComponentHandler = new SilentComponentHandler();
						//silentComponentHandler->test=400;
						result = selectedEditController->setComponentHandler(silentComponentHandler);
						browserLogInteger("selectedEditController->setComponentHandler",result);
						Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
						selectedProcessor = selectedComponent;
						if (!selectedProcessor) {
							return false;
						} else {
							Steinberg::Vst::ProcessSetup setup = {};
							setup.maxSamplesPerBlock = 2048;
							setup.sampleRate = sampleRate;
							setup.symbolicSampleSize = Steinberg::Vst::SymbolicSampleSizes::kSample32;
							setup.processMode = Steinberg::Vst::ProcessModes::kRealtime;
							result = selectedProcessor->setupProcessing(setup);
							Steinberg::Vst::AudioBusBuffers inputsAudioBusBuffers;
							Steinberg::Vst::AudioBusBuffers outAudioBusBuffers;
							Steinberg::Vst::AudioBusBuffers* inputBuses = &inputsAudioBusBuffers;
							Steinberg::Vst::AudioBusBuffers* outputBuses = &outAudioBusBuffers;
							int coInputBusCount = createBuffers(*selectedComponent, inputBuses, Steinberg::Vst::BusDirections::kInput, durationInSamples, Steinberg::Vst::kSample32);
							int coOutBusCount = createBuffers(*selectedComponent, outputBuses, Steinberg::Vst::BusDirections::kOutput, durationInSamples, Steinberg::Vst::kSample32);
							Steinberg::Vst::SpeakerArrangement* inSpeakerArrangement = nullptr;
							Steinberg::Vst::SpeakerArrangement* outSpeakerArrangement = nullptr;
							if (coInputBusCount > 0) {
								inSpeakerArrangement = new Steinberg::Vst::SpeakerArrangement[coInputBusCount];
								for (int i = 0; i < coInputBusCount; i++) {
									inSpeakerArrangement[i] = Steinberg::Vst::SpeakerArr::kStereo;
								}
							}
							if (coOutBusCount > 0) {
								outSpeakerArrangement = new Steinberg::Vst::SpeakerArrangement[coOutBusCount];
								for (int i = 0; i < coOutBusCount; i++) {
									outSpeakerArrangement[i] = Steinberg::Vst::SpeakerArr::kStereo;
								}
							}
							result = selectedProcessor->setBusArrangements(inSpeakerArrangement, coInputBusCount, outSpeakerArrangement, coOutBusCount);
							browserLogInteger("setBusArrangements in/out stereo", result);
							result = selectedProcessor->canProcessSampleSize(Steinberg::Vst::SymbolicSampleSizes::kSample32);
							//int framePosition = 0;
							//double const beatPerMinute = 120.0;
							//double beatPerSecond = beatPerMinute / 60.0;
							Steinberg::Vst::ProcessContext vstProcessContext;
							vstProcessContext.sampleRate = setup.sampleRate;
							//vstProcessContext.projectTimeSamples = framePosition;
							//vstProcessContext.projectTimeMusic = framePosition / setup.sampleRate * beatPerSecond;
							//vstProcessContext.tempo = beatPerMinute;
							//vstProcessContext.timeSigDenominator = 4;
							//vstProcessContext.timeSigNumerator = 4;
							vstProcessContext.state = Steinberg::Vst::ProcessContext::StatesAndFlags::kPlaying
							                          //| Steinberg::Vst::ProcessContext::StatesAndFlags::kProjectTimeMusicValid
							                          //| Steinberg::Vst::ProcessContext::StatesAndFlags::kTempoValid
							                          //| Steinberg::Vst::ProcessContext::StatesAndFlags::kTimeSigValid
							                          ;
							//vstProcessContext.systemTime = 0;

							inputParameterChanges.setMaxParameters(selectedEditController->getParameterCount());
							outParameterChanges.setMaxParameters(selectedEditController->getParameterCount());
							inputParameterChanges.clearQueue();
							outParameterChanges.clearQueue();
							process_data.processContext = &vstProcessContext;
							process_data.processMode = Steinberg::Vst::ProcessModes::kRealtime;
							process_data.symbolicSampleSize = Steinberg::Vst::SymbolicSampleSizes::kSample32;
							process_data.numSamples = durationInSamples;
							process_data.numInputs = coInputBusCount;
							process_data.numOutputs = coOutBusCount;
							process_data.inputs = inputBuses;
							process_data.outputs = outputBuses;
							process_data.inputEvents = &inputEventList;
							process_data.outputEvents = &outEventList;
							process_data.inputParameterChanges = &inputParameterChanges;
							process_data.outputParameterChanges = &outParameterChanges;
							selectedComponent->setActive(true);
							selectedProcessor->setProcessing (true);
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
	int VST3_process(float* inputBufferLeft, float* inputBufferRight, float* outputBufferLeft, float* outputBufferRight)
	{
		int r = -1;
		Steinberg::FUnknownPtr<Steinberg::Vst::IAudioProcessor> selectedProcessor = selectedComponent;
		for (int i = 0; i < process_data.numInputs && i < 1; i++) {
			Steinberg::Vst::BusInfo busInfo = {0};
			int result = selectedComponent->getBusInfo (Steinberg::Vst::kAudio, Steinberg::Vst::BusDirections::kInput, i, busInfo);
			int numChannels = busInfo.channelCount;
			for (int c = 0; c < numChannels && c < 1; c++) {
				for (int n = 0; n < process_data.numSamples; n++) {
					process_data.inputs[i].channelBuffers32[c][n] = inputBufferLeft[n];
					if (numChannels > 1) {
						process_data.inputs[i].channelBuffers32[c + 1][n] = inputBufferRight[n];
					}
				}
			}
		}
		int cnt = selectedEditController->getParameterCount();
		for (int i = 0; i < cnt; i++) {
			selectedEditController->getParameterInfo (i, parameterInfo);
			double value = selectedEditController->getParamNormalized( parameterInfo.id);
			//double plain=selectedEditController->normalizedParamToPlain(parameterInfo.id, value);
			//Steinberg::Vst::IParamValueQueue* queue = 0;
			int parameterIndex = 0;
			Steinberg::Vst::IParamValueQueue* queue = inputParameterChanges.addParameterData(i, parameterIndex);
			int pointIndex = 0;
			int sampleOffset = 0;
			queue->addPoint (sampleOffset, value, pointIndex);
			//queue->addPoint (sampleOffset, plain, pointIndex);
		}
		r = selectedProcessor->process (process_data);
		inputParameterChanges.clearQueue();
		inputEventList.clear();
		/*
		if (data.outputParameterChanges)
		{
			int32 index;
			IParamValueQueue* queue = data.outputParameterChanges->addParameterData (kParamActiveVoices, index);
			if (queue)
			{
				queue->addPoint (0, (ParamValue)voiceProcessor->getActiveVoices () / (ParamValue)MAX_VOICES, index);
			}
		}
		for(int i = 0; i < output_changes_.getParameterCount(); ++i) {
			auto *queue = output_changes_.getParameterData(i);
			if(queue && queue->getPointCount() > 0) {
				hwm::dout << "Output parameter count [" << i << "] : " << queue->getPointCount() << std::endl;
			}
		}
		*/
		for (int i = 0; i < process_data.numOutputs && i < 1; i++) {
			Steinberg::Vst::BusInfo busInfo = {0};
			int result = selectedComponent->getBusInfo (Steinberg::Vst::kAudio, Steinberg::Vst::BusDirections::kOutput, i, busInfo);
			int numChannels = busInfo.channelCount;
			for (int c = 0; c < numChannels && c < 1; c++) {
				for (int n = 0; n < process_data.numSamples; n++) {
					outputBufferLeft[n] = process_data.outputs[i].channelBuffers32[c][n];
					if (numChannels > 1) {
						outputBufferRight[n] = process_data.outputs[i].channelBuffers32[c + 1][n];
					} else {
						outputBufferRight[n] = process_data.outputs[i].channelBuffers32[c][n];
					}
				}
			}
		}
		/*if(outParameterChanges.getParameterCount()>0){
			browserLogInteger("outParameterChanges",outParameterChanges.getParameterCount());
		}*/
		outParameterChanges.clearQueue();
		/*for(int i = 0; i < output_changes_.getParameterCount(); ++i) {
			auto *queue = output_changes_.getParameterData(i);
			if(queue && queue->getPointCount() > 0) {
				hwm::dout << "Output parameter count [" << i << "] : " << queue->getPointCount() << std::endl;
			}
		}*/
		return r;
	}
}

