#
PROJECTNAME = NEX
SUBNAME = NOUI
TARGET = ./web/$(PROJECTNAME).js
PLUGINID = 6EE65CD1B83A4AF480AA7929AEA6B8A0
SAMPLESFOLDER = ../../vstsamples/note_expression_synth
SOURCEFOLDER = $(SAMPLESFOLDER)/source
INCLUDEFOLDER = $(SAMPLESFOLDER)/source

VSTLIB = ../../i
CPPLIB = ../../i/CppLib

IFOLDERS = -I$(INCLUDEFOLDER)
IFOLDERS += -I$(VSTLIB)/vstgui4
IFOLDERS += -I$(VSTLIB)
IFOLDERS += -I$(CPPLIB)/include

CFLAGS = $(IFOLDERS) -Wno-logical-op-parentheses -g
#CFLAGS += -std=c++11
CFLAGS += -std=c++14
CFLAGS += -stdlib=libxx
#headers CFLAGS += -H
#verbose CFLAGS += -v
CFLAGS += -D__gnu_linux__=1
CFLAGS += -D__linux__=1
CFLAGS += -D__x86_64__=1
CFLAGS += -D__INTEL__=1
CFLAGS += -D__INTEL_CXX11_MODE__
CFLAGS += -DTARGET_CPU_X86_64=1 
CFLAGS += -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
CFLAGS += -s "EXPORTED_FUNCTIONS=['_VST3_classInfo','_VST3_init', '_VST3_description', '_VST3_selectProcessor', '_VST3_parametersCount', '_VST3_parameterInfo', '_VST3_process', '_VST3_setParameter', '_VST3_sendNote']"
CFLAGS += -D_DEBUG=1
CFLAGS += -DDEVELOPMENT=1
CFLAGS += -s ERROR_ON_UNDEFINED_SYMBOLS=0
COMPILER = emcc
LDFLAGS = -O2
JSFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s BINARYEN_ASYNC_COMPILATION=0 
JSFLAGS += -s EXPORT_NAME="'AudioWorkletGlobalScope.WAM.$(PROJECTNAME)'"

PLUGINSOURCE = $(SOURCEFOLDER)/factory.cpp \
	$(SOURCEFOLDER)/note_expression_synth_controller.cpp \
	$(SOURCEFOLDER)/note_expression_synth_processor.cpp \
	$(SOURCEFOLDER)/note_expression_synth_ui.cpp \
	$(SOURCEFOLDER)/note_expression_synth_voice.cpp \
	$(SOURCEFOLDER)/note_touch_controller.cpp

VSTRUNTIME = $(VSTLIB)/base/source/fbuffer.cpp
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
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/utility/test/ringbuffertest.cpp

VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/contrib/keyboardview.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/animation/animations.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/animation/animator.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/animation/timingfunctions.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cbitmap.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cbitmapfilter.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/ccolor.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cdrawcontext.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cdrawcontext.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cdrawmethods.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cfont.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cframe.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cgradientview.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cgraphicspath.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/clayeredviewcontainer.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/clinestyle.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/coffscreencontext.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cbuttons.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/ccontrol.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cknob.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cmoviebitmap.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cmoviebutton.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/coptionmenu.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cparamdisplay.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cscrollbar.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/csearchtextedit.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/csegmentbutton.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cslider.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/csplashscreen.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cswitch.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cswitch.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/ctextedit.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/ctextlabel.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cvumeter.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/controls/cxypad.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/crect.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/crowcolumnview.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cscrollview.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cshadowviewcontainer.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/csplitview.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cstring.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/ctooltipsupport.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cview.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cviewcontainer.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/cvstguitimer.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairobitmap.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairofont.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairogradient.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/linuxstring.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/x11frame.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/x11timer.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/lib/vstguidebug.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3editor.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3groupcontroller.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3padcontroller.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/uidescription/cstream.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/uidescription/uiattributes.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/uidescription/uidescription.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewcreator.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewfactory.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewswitchcontainer.cpp
VSTRUNTIME += $(VSTLIB)/vstgui4/vstgui/uidescription/xmlparser.cpp


#warning: undefined symbol: _ZN6VSTGUI9CGradient6createERKNSt3__28multimapIdNS_6CColorENS1_4lessIdEENS1_9allocatorINS1_4pairIKdS3_EEEEEE
#warning: undefined symbol: _ZN9__gnu_cxx12__atomic_addEPVii

.PHONY: $(TARGET)
$(TARGET):
	#export EMCC_DEBUG=1
	#emcc --clear-cache
	$(COMPILER) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ ../../tools/VST3JSExport.cpp $(PLUGINSOURCE) $(VSTRUNTIME) $(VST4UI)
#	$(COMPILER) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ ../../tools/VST3JSExport.cpp $(PLUGINSOURCE) $(VSTRUNTIME)
	cp ../../tools/index.html ./web/$(PROJECTNAME).$(SUBNAME).html
	cp ../../tools/lib.js ./web/$(PROJECTNAME).$(SUBNAME).lib.js
	cp ../../tools/processormodule.js ./web/$(PROJECTNAME).$(SUBNAME).processor.js
#	copy /Y ..\..\tools\index.html .\web\$(PROJECTNAME).$(SUBNAME).html
#	copy /Y ..\..\tools\lib.js .\web\$(PROJECTNAME).$(SUBNAME).lib.js
#	copy /Y ..\..\tools\processormodule.js .\web\$(PROJECTNAME).$(SUBNAME).processor.js
	node ../../tools/copyconvert.js $(PROJECTNAME) ./web/$(PROJECTNAME).wasm ./web $(PLUGINID) $(SUBNAME)


