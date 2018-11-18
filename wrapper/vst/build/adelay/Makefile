PROJECTNAME = DLY
TARGET = ./web/$(PROJECTNAME).js
PLUGINID = 0CDBB66985D548A9BFD8371909D24BB3

SAMPLESFOLDER = ../../vstsamples
SOURCEFOLDER = $(SAMPLESFOLDER)/adelay/source
INCLUDEFOLDER = $(SAMPLESFOLDER)/adelay/include

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
#CFLAGS += -s ENVIRONMENT=web
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

PLUGINSOURCE = $(SOURCEFOLDER)/adelaycontroller.cpp \
	$(SOURCEFOLDER)/adelayprocessor.cpp \
	$(SOURCEFOLDER)/exampletest.cpp \
	$(SOURCEFOLDER)/factory.cpp


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
VSTRUNTIME += $(VSTLIB)/public.sdk/source/vst/utility/test/ringbuffertest.cpp


VST4UI = $(VSTLIB)/vstgui4/vstgui/contrib/keyboardview.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/animation/animations.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/animation/animator.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/animation/timingfunctions.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cbitmap.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cbitmapfilter.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/ccolor.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cdrawcontext.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cdrawcontext.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cdrawmethods.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cfont.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cframe.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cgradientview.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cgraphicspath.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/clayeredviewcontainer.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/clinestyle.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/coffscreencontext.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cbuttons.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/ccontrol.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cknob.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cmoviebitmap.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cmoviebutton.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/coptionmenu.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cparamdisplay.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cscrollbar.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/csearchtextedit.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/csegmentbutton.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cslider.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/csplashscreen.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cswitch.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cswitch.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/ctextedit.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/ctextlabel.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cvumeter.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/controls/cxypad.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/crect.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/crowcolumnview.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cscrollview.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cshadowviewcontainer.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/csplitview.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cstring.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/ctooltipsupport.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cview.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cviewcontainer.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/cvstguitimer.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairobitmap.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairofont.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/cairogradient.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/linuxstring.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/x11frame.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/platform/linux/x11timer.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/lib/vstguidebug.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3editor.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3groupcontroller.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/plugin-bindings/vst3padcontroller.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/uidescription/cstream.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/uidescription/uiattributes.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/uidescription/uidescription.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewcreator.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewfactory.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/uidescription/uiviewswitchcontainer.cpp
VST4UI += $(VSTLIB)/vstgui4/vstgui/uidescription/xmlparser.cpp


.PHONY: $(TARGET)
$(TARGET):
#	$(COMPILER) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ ../../tools/VST3JSExport.cpp $(PLUGINSOURCE) $(VSTRUNTIME) $(VST4UI)
	$(COMPILER) $(CFLAGS) $(LDFLAGS) $(JSFLAGS) -o $@ ../../tools/VST3JSExport.cpp $(PLUGINSOURCE) $(VSTRUNTIME)
	cp ../../tools/index.html ./web/$(PROJECTNAME).html
	cp ../../tools/lib.js ./web/$(PROJECTNAME).lib.js
	cp ../../tools/processormodule.js ./web/$(PROJECTNAME).processor.js
#	copy /Y ..\..\tools\index.html .\web\$(PROJECTNAME).html
#	copy /Y ..\..\tools\lib.js .\web\$(PROJECTNAME).lib.js
#	copy /Y ..\..\tools\processormodule.js .\web\$(PROJECTNAME).processor.js
	node ../../tools/copyconvert.js $(PROJECTNAME) ./web/$(PROJECTNAME).wasm ./web $(PLUGINID)


