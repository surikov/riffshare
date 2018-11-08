#
PROJECTNAME = VSTNES
TARGET = ./web/$(PROJECTNAME).js
CODEFOLDER = ../../vstsamples/note_expression_synth
SOURCEFOLDER = $(CODEFOLDER)/source
INCLUDEFOLDER = $(CODEFOLDER)/source

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
	$(SOURCEFOLDER)/factory.cpp \
	$(SOURCEFOLDER)/note_expression_synth_controller.cpp \
	$(SOURCEFOLDER)/note_expression_synth_processor.cpp \
	$(SOURCEFOLDER)/note_expression_synth_ui.cpp \
	$(SOURCEFOLDER)/note_expression_synth_voice.cpp \
	$(SOURCEFOLDER)/note_touch_controller.cpp

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
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cview.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/contrib/keyboardview.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/vstguidebug.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cframe.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3editor.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cstring.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/coptionmenu.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cparamdisplay.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cviewcontainer.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/uidescription/uiattributes.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cvstguitimer.cpp


########### _ZN6VSTGUI9CGradient6createERKNSt3__28multimapIdNS_6CColorENS1_4lessIdEENS1_9allocatorINS1_4pairIKdS3_EEEEEE
CFILES += $(VSTLIB)/vstgui4/vstgui/uidescription/uidescription.cpp




#CFILES += $(VSTLIB)/vstgui4/vstgui/uidescription/cstream.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cdrawcontext.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cbitmapfilter.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3padcontroller.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewfactory.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cgraphicspath.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/ctooltipsupport.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cbitmap.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/uidescription/xmlparser.cpp
CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/ccontrol.cpp
CFILES += $(VSTLIB)/public.sdk/source/common/pluginview.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairofont.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3groupcontroller.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/ctextedit.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cxypad.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/coffscreencontext.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/ctextlabel.cpp
#CFILES += $(VSTLIB)/public.sdk/source/main/linuxmain.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cfont.cpp
#CFILES += $(VSTLIB)/base/source/timer.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewcreator.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cscrollview.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/csplitview.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cswitch.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cbuttons.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cdrawmethods.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cmoviebitmap.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cgradientview.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/crowcolumnview.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/csegmentbutton.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cshadowviewcontainer.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/csplashscreen.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cknob.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cswitch.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/cdrawcontext.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cscrollbar.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/csearchtextedit.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/clayeredviewcontainer.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewswitchcontainer.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cslider.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cmoviebutton.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/clinestyle.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/ccolor.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/animation/timingfunctions.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/controls/cvumeter.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/animation/animator.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairobitmap.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/x11frame.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/linuxstring.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/x11timer.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/animation/animations.cpp
#CFILES += $(VSTLIB)/vstgui4/vstgui/lib/crect.cpp

#warning: undefined symbol: _ZN6VSTGUI9CGradient6createERKNSt3__28multimapIdNS_6CColorENS1_4lessIdEENS1_9allocatorINS1_4pairIKdS3_EEEEEE
#warning: undefined symbol: _ZN9__gnu_cxx12__atomic_addEPVii

.PHONY: $(TARGET)
$(TARGET):
	#export EMCC_DEBUG=1
	#emcc --clear-cache
	$(COMPILER) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ $(CFILES)
	#cd ./web/ & pwd & node ../../tools/encode-wasm.js $(PROJECTNAME).wasm
	#cp ../../tools/index.html ./web/
	#cp ../../tools/index.js ./web/
	#cp ../../tools/processormodule.js ./web/

