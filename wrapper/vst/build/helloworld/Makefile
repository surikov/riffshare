PROJECTNAME = VSTHELLOWORLD
TARGET = ./web/$(PROJECTNAME).js
PLUGINID = BD58B550F9E5634E9D2EFF39EA0927B1

SAMPLESFOLDER = ../../vstsamples
SOURCEFOLDER = $(SAMPLESFOLDER)/helloworld/source
INCLUDEFOLDER = $(SAMPLESFOLDER)/helloworld/include

VSTLIB = ../../i
CPPLIB = ../../i/CppLib

IFOLDERS = -I$(INCLUDEFOLDER)
IFOLDERS += -I$(VSTLIB)/vstgui4/vstgui/lib/platform/linux
IFOLDERS += -I$(VSTLIB)/vstgui4
IFOLDERS += -I$(VSTLIB)
IFOLDERS += -I$(CPPLIB)/include

CFLAGS = $(IFOLDERS) -Wno-logical-op-parentheses -g4
CFLAGS += -std=c++14
CFLAGS += -stdlib=libxx
#headers CFLAGS += -H
#verbose CFLAGS += -v
#CFLAGS += -s ASSERTIONS=1
CFLAGS += -D__gnu_linux__=1
CFLAGS += -D__linux__=1
CFLAGS += -D__x86_64__=1
CFLAGS += -D__INTEL__=1
CFLAGS += -D__INTEL_CXX11_MODE__
CFLAGS += -DTARGET_CPU_X86_64=1 
CFLAGS += -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
CFLAGS += -s "EXPORTED_FUNCTIONS=['_VST3_classInfo','_VST3_init', '_VST3_description', '_VST3_setInteger', '_VST3_selectProcessor', '_VST3_parametersCount', '_VST3_parameterInfo', '_VST3_process']"
CFLAGS += -D_DEBUG=1
CFLAGS += -DDEVELOPMENT=1
CFLAGS += -s ERROR_ON_UNDEFINED_SYMBOLS=0
COMPILER = emcc
LDFLAGS = -O2
JSFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 
JSFLAGS += -s EXPORT_NAME="'AudioWorkletGlobalScope.WAM.$(PROJECTNAME)'"

CUSTOMFILES = ../../tools/VST3JSExport.cpp \
	$(SOURCEFOLDER)/plugcontroller.cpp \
	$(SOURCEFOLDER)/plugfactory.cpp \
	$(SOURCEFOLDER)/plugprocessor.cpp 

VSTRUNTIME = ../../tools/VST3JSExport.cpp
VSTRUNTIME += $(VSTLIB)/base/source/fbuffer.cpp
VSTRUNTIME += $(VSTLIB)/base/source/fdebug.cpp
VSTRUNTIME += $(VSTLIB)/base/source/fdynlib.cpp
VSTRUNTIME += $(VSTLIB)/base/source/fobject.cpp
VSTRUNTIME += $(VSTLIB)/base/source/fstreamer.cpp
VSTRUNTIME += $(VSTLIB)/base/source/fstring.cpp
VSTRUNTIME += $(VSTLIB)/base/source/timer.cpp
VSTRUNTIME += $(VSTLIB)/base/source/timer.cpp
VSTRUNTIME += $(VSTLIB)/base/source/updatehandler.cpp
VSTRUNTIME += $(VSTLIB)/base/thread/source/fcondition.cpp
VSTRUNTIME += $(VSTLIB)/base/thread/source/flock.cpp
VSTRUNTIME += $(VSTLIB)/pluginterfaces/base/conststringtable.cpp
VSTRUNTIME += $(VSTLIB)/pluginterfaces/base/coreiids.cpp
VSTRUNTIME += $(VSTLIB)/pluginterfaces/base/funknown.cpp
VSTRUNTIME += $(VSTLIB)/pluginterfaces/base/ustring.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/common/pluginview.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/main/linuxmain.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/main/pluginfactoryvst3.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/hosting/eventlist.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/hosting/parameterchanges.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/hosting/processdata.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstaudioeffect.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstbus.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstbypassprocessor.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstcomponent.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstcomponentbase.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vsteditcontroller.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstguieditor.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstinitiids.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstnoteexpressiontypes.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstparameters.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstpresetfile.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstrepresentation.cpp
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/vstsinglecomponenteffect.cpp

.PHONY: $(TARGET)
$(TARGET):
	$(COMPILER) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ $(CUSTOMFILES) $(VSTRUNTIME)
	cp ../../tools/index.html ./web
	cp ../../tools/index.js ./web
	cp ../../tools/processormodule.js ./web
#	copy /Y ..\..\tools\index.html .\web
#	copy /Y ..\..\tools\index.js .\web
#	copy /Y ..\..\tools\processormodule.js .\web
	node ../../tools/convert.js $(PROJECTNAME) ./web/$(PROJECTNAME).wasm ./web $(PLUGINID)


