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
/*
namespace Steinberg {
//DEF_CLASS_IID (FUnknown)
DEF_CLASS_IID (IDependent)
//DEF_CLASS_IID (IPluginBase)
DEF_CLASS_IID (ICloneable)
DEF_CLASS_IID (IUpdateHandler)
DEF_CLASS_IID (IBStream)
DEF_CLASS_IID (ISizeableStream)
namespace Vst {
DEF_CLASS_IID (IComponent)
DEF_CLASS_IID (IAudioProcessor)
DEF_CLASS_IID (IConnectionPoint)
DEF_CLASS_IID (IEditController)
DEF_CLASS_IID (IEditController2)
DEF_CLASS_IID (IComponentHandler)
DEF_CLASS_IID (IComponentHandler2)
}
}
*/
extern "C" {

	int VST3_status() {
		return -1;
	}
	char const* VST3_description() {
		Steinberg::IPluginFactory* f = GetPluginFactory();
		Steinberg::PFactoryInfo i;
		f->getFactoryInfo (&i);
		std::ostringstream txt;
		txt << "{"
		    << "\"vendor\":\"" << i.vendor << "\"";
		int cc = f->countClasses();
		txt << ",\"count\":\"" << cc << "\"";
		txt << ",\"plugins\":[";		
		char dlmtr = ' ';
		for (int i = 0; i < cc; i++) {
			txt << dlmtr << i;
			//Steinberg::PClassInfo info;
			//f->getClassInfo (i, &info);
			//txt << dlmtr << "{";
			//txt << "\"n\":\"" << i << "\""
			    //<< ",\"category\":\"" << info.category << "\""
			    //<< ",\"name\":\"" << info.name << "\""
			    //;
			//Steinberg::FUnknown* obj;
			//int rr = f->createInstance (info.cid, Steinberg::FUnknown::iid, (void**)&obj);
			//txt << ",\"load\":\"" << rr << "\"";
			//
			//obj->release ();
			//txt << "}";
			dlmtr = ',';
		}
		f->release ();
		txt << "]}";

		char const *p = txt.str().c_str();
		return p;
	}
	char const* VST3_setInteger(char* name, int value) {
		char buffer[999];
		snprintf(buffer, sizeof(buffer), "Set %s: %d", name, value);
		char const *p = buffer;
		return p;
	}
	void VST3_stub() {
	}
}


