#
PROJECTNAME = VSTMDA
TARGET = ./web/$(PROJECTNAME).js

SOURCEFOLDER = /Users/sss/Documents/VST_SDK/VST3_SDK/public.sdk/samples/vst/mda-vst3/source
INCLUDEFOLDER = /Users/sss/Documents/VST_SDK/VST3_SDK/public.sdk/samples/vst/mda-vst3/source

VSTLIB = /Users/sss/Documents/gitHubPrj/riffshare/wrapper/vst/tools/VST3lib
CPPLIB = /Users/sss/Documents/gitHubPrj/riffshare/wrapper/vst/tools/CppLib

IFOLDERS = -I$(INCLUDEFOLDER)
IFOLDERS += -I$(VSTLIB)/vstgui4
IFOLDERS += -I$(VSTLIB)
IFOLDERS += -I$(CPPLIB)/include

CFLAGS = $(IFOLDERS) -Wno-logical-op-parentheses -g
CFLAGS += -std=c++11
CFLAGS += -stdlib=libxx
#headers CFLAGS += -H
#verbose CFLAGS += -v
CFLAGS += -D__gnu_linux__=1
CFLAGS += -D__linux__=1
CFLAGS += -D__x86_64__=1
CFLAGS += -D__INTEL__=1
CFLAGS += -D__INTEL_CXX11_MODE__
CFLAGS += -DTARGET_CPU_X86_64=1 
CFLAGS += -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'
CFLAGS += -s EXPORTED_FUNCTIONS='["_VST3_stub","_VST3_status", "_VST3_description", "_VST3_setInteger"]'
CFLAGS += -D_DEBUG=1
CFLAGS += -DDEVELOPMENT=1
CFLAGS += -s ERROR_ON_UNDEFINED_SYMBOLS=0
COMPILER = emcc
LDFLAGS = -O2
JSFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 
JSFLAGS += -s EXPORT_NAME="'AudioWorkletGlobalScope.WAM.$(PROJECTNAME)'"

CFILES = ../../tools/VST3JSExport.cpp \
	$(SOURCEFOLDER)/mdaAmbienceController.cpp \
	$(SOURCEFOLDER)/mdaAmbienceProcessor.cpp \
	$(SOURCEFOLDER)/mdaBandistoController.cpp \
	$(SOURCEFOLDER)/mdaBandistoProcessor.cpp \
	$(SOURCEFOLDER)/mdaBaseController.cpp \
	$(SOURCEFOLDER)/mdaBaseProcessor.cpp \
	$(SOURCEFOLDER)/mdaBeatBoxController.cpp \
	$(SOURCEFOLDER)/mdaBeatBoxProcessor.cpp \
	$(SOURCEFOLDER)/mdaComboController.cpp \
	$(SOURCEFOLDER)/mdaComboProcessor.cpp \
	$(SOURCEFOLDER)/mdaDX10Controller.cpp \
	$(SOURCEFOLDER)/mdaDX10Processor.cpp \
	$(SOURCEFOLDER)/mdaDeEsserController.cpp \
	$(SOURCEFOLDER)/mdaDeEsserProcessor.cpp \
	$(SOURCEFOLDER)/mdaDegradeController.cpp \
	$(SOURCEFOLDER)/mdaDegradeProcessor.cpp \
	$(SOURCEFOLDER)/mdaDelayController.cpp \
	$(SOURCEFOLDER)/mdaDelayProcessor.cpp \
	$(SOURCEFOLDER)/mdaDetuneController.cpp \
	$(SOURCEFOLDER)/mdaDetuneProcessor.cpp \
	$(SOURCEFOLDER)/mdaDitherController.cpp \
	$(SOURCEFOLDER)/mdaDitherProcessor.cpp \
	$(SOURCEFOLDER)/mdaDubDelayController.cpp \
	$(SOURCEFOLDER)/mdaDubDelayProcessor.cpp \
	$(SOURCEFOLDER)/mdaDynamicsController.cpp \
	$(SOURCEFOLDER)/mdaDynamicsProcessor.cpp \
	$(SOURCEFOLDER)/mdaEPianoController.cpp \
	$(SOURCEFOLDER)/mdaEPianoProcessor.cpp \
	$(SOURCEFOLDER)/mdaImageController.cpp \
	$(SOURCEFOLDER)/mdaImageProcessor.cpp \
	$(SOURCEFOLDER)/mdaJX10Controller.cpp \
	$(SOURCEFOLDER)/mdaJX10Processor.cpp \
	$(SOURCEFOLDER)/mdaLeslieController.cpp \
	$(SOURCEFOLDER)/mdaLeslieProcessor.cpp \
	$(SOURCEFOLDER)/mdaLimiterController.cpp \
	$(SOURCEFOLDER)/mdaLimiterProcessor.cpp \
	$(SOURCEFOLDER)/mdaLoudnessController.cpp \
	$(SOURCEFOLDER)/mdaLoudnessProcessor.cpp \
	$(SOURCEFOLDER)/mdaMultiBandController.cpp \
	$(SOURCEFOLDER)/mdaMultiBandProcessor.cpp \
	$(SOURCEFOLDER)/mdaOverdriveController.cpp \
	$(SOURCEFOLDER)/mdaOverdriveProcessor.cpp \
	$(SOURCEFOLDER)/mdaParameter.cpp \
	$(SOURCEFOLDER)/mdaPianoController.cpp \
	$(SOURCEFOLDER)/mdaPianoProcessor.cpp \
	$(SOURCEFOLDER)/mdaRePsychoController.cpp \
	$(SOURCEFOLDER)/mdaRePsychoProcessor.cpp \
	$(SOURCEFOLDER)/mdaRezFilterController.cpp \
	$(SOURCEFOLDER)/mdaRezFilterProcessor.cpp \
	$(SOURCEFOLDER)/mdaRingModController.cpp \
	$(SOURCEFOLDER)/mdaRingModProcessor.cpp \
	$(SOURCEFOLDER)/mdaRoundPanController.cpp \
	$(SOURCEFOLDER)/mdaRoundPanProcessor.cpp \
	$(SOURCEFOLDER)/mdaShepardController.cpp \
	$(SOURCEFOLDER)/mdaShepardProcessor.cpp \
	$(SOURCEFOLDER)/mdaSpecMeterController.cpp \
	$(SOURCEFOLDER)/mdaSpecMeterProcessor.cpp \
	$(SOURCEFOLDER)/mdaSplitterController.cpp \
	$(SOURCEFOLDER)/mdaSplitterProcessor.cpp \
	$(SOURCEFOLDER)/mdaStereoController.cpp \
	$(SOURCEFOLDER)/mdaStereoProcessor.cpp \
	$(SOURCEFOLDER)/mdaSubSynthController.cpp \
	$(SOURCEFOLDER)/mdaSubSynthProcessor.cpp \
	$(SOURCEFOLDER)/mdaTalkBoxController.cpp \
	$(SOURCEFOLDER)/mdaTalkBoxProcessor.cpp \
	$(SOURCEFOLDER)/mdaTestToneController.cpp \
	$(SOURCEFOLDER)/mdaTestToneProcessor.cpp \
	$(SOURCEFOLDER)/mdaThruZeroController.cpp \
	$(SOURCEFOLDER)/mdaThruZeroProcessor.cpp \
	$(SOURCEFOLDER)/mdaTrackerController.cpp \
	$(SOURCEFOLDER)/mdaTrackerProcessor.cpp \
	$(SOURCEFOLDER)/mdafactory.cpp
CFILES += $(VSTLIB)/pluginterfaces/base/conststringtable.cpp
CFILES += $(VSTLIB)/pluginterfaces/base/coreiids.cpp
CFILES += $(VSTLIB)/pluginterfaces/base/funknown.cpp
CFILES += $(VSTLIB)/pluginterfaces/base/ustring.cpp
CFILES += $(VSTLIB)/base/source/fbuffer.cpp
CFILES += $(VSTLIB)/base/source/fdebug.cpp
CFILES += $(VSTLIB)/base/source/fdynlib.cpp
CFILES += $(VSTLIB)/base/source/fobject.cpp
CFILES += $(VSTLIB)/base/source/fstreamer.cpp
CFILES += $(VSTLIB)/base/source/fstring.cpp
CFILES += $(VSTLIB)/base/source/timer.cpp
CFILES += $(VSTLIB)/base/source/updatehandler.cpp
CFILES += $(VSTLIB)/base/thread/source/fcondition.cpp
CFILES += $(VSTLIB)/base/thread/source/flock.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstaudioeffect.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstbus.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstbypassprocessor.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstcomponent.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstcomponentbase.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstguieditor.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstinitiids.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstnoteexpressiontypes.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstparameters.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstpresetfile.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstrepresentation.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vstsinglecomponenteffect.cpp
CFILES += $(VSTLIB)/public.sdk/source/vst/vsteditcontroller.cpp
CFILES += $(VSTLIB)/public.sdk/source/main/pluginfactoryvst3.cpp

.PHONY: $(TARGET)
$(TARGET):
	#export EMCC_DEBUG=1
	#emcc --clear-cache
	$(COMPILER) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ $(CFILES)
	#cd ./web/ & pwd & node ../../tools/encode-wasm.js $(PROJECTNAME).wasm
	#cp ../../tools/index.html ./web/
	#cp ../../tools/index.js ./web/
	#cp ../../tools/processormodule.js ./web/

