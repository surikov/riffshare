var drumInfo = [{
		sound: _drum_35_0_Chaos_sf2_file,
		pitch: 36, //36
		title: 'Bass drum',
		id: 0,
		volumeRatio: 0.5,
		length: 0.5
	}, {
		sound: _drum_41_26_JCLive_sf2_file,
		pitch: 41, //43
		title: 'Low Tom',
		id: 1,
		volumeRatio: 0.5,
		length: 0.5
	}, {
		sound: _drum_38_22_FluidR3_GM_sf2_file,
		pitch: 38, //40
		title: 'Snare drum',
		id: 2,
		volumeRatio: 0.75,
		length: 0.5
	}, {
		sound: _drum_45_26_JCLive_sf2_file,
		pitch: 45, //47,48,50
		title: 'Mid Tom',
		id: 3,
		volumeRatio: 0.75,
		length: 0.5
	}, {
		sound: _drum_42_26_JCLive_sf2_file,
		pitch: 42, //44
		title: 'Closed Hi-hat',
		id: 4,
		volumeRatio: 0.5,
		length: 1
	}, {
		sound: _drum_46_26_JCLive_sf2_file,
		pitch: 46, //
		title: 'Open Hi-hat',
		id: 5,
		volumeRatio: 0.5,
		length: 1
	}, {
		sound: _drum_51_26_JCLive_sf2_file,
		pitch: 51, //rest
		title: 'Ride Cymbal',
		id: 6,
		volumeRatio: 0.3,
		length: 2
	}, {
		sound: _drum_49_26_JCLive_sf2_file,
		pitch: 49, //
		title: 'Splash Cymbal',
		id: 7,
		volumeRatio: 0.3,
		length: 3
	}
];
var trackInfo = [{
		color: 'rgba(255,204,187,1)',
		shadow: 'rgba(255,204,187,0.4)',
		title: 'Synth Bass',
		order: 2,
		sound: _tone_0390_GeneralUserGS_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage('track7'), 0, 70, 100),
		nn: 7,
		octave: 3,
		volumeRatio: 0.5
	}, {
		color: 'rgba(204,153,0,1)',
		shadow: 'rgba(204,153,0,0.4)',
		title: 'String Ensemble',
		order: 1,
		sound: _tone_0480_Aspirin_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage('track6'), 0, 70, 100),
		nn: 6,
		octave: 3,
		volumeRatio: 0.6
	}, {
		color: 'rgba(204,0,204,1)',
		shadow: 'rgba(204,0,204,0.4)',
		title: 'Bass guitar',
		order: 5,
		sound: _tone_0330_SoundBlasterOld_sf2,
		volume: sureNumeric(readObjectFromlocalStorage('track5'), 0, 70, 100),
		nn: 5,
		octave: 2,
		volumeRatio: 0.99
	}, {
		color: 'rgba(00,153,255,1)',
		shadow: 'rgba(00,153,255,0.4)',
		title: 'Acoustic Piano',
		order: 3,
		sound: _tone_0000_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage('track4'), 0, 70, 100),
		nn: 4,
		octave: 3,
		volumeRatio: 0.9
	}, {
		color: 'rgba(153,51,0,1)',
		shadow: 'rgba(153,51,0,0.4)',
		title: 'PalmMute guitar',
		order: 4,
		sound: _tone_0280_LesPaul_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage('track3'), 0, 70, 100),
		nn: 3,
		octave: 3,
		volumeRatio: 0.9
	}, {
		color: 'rgba(51,51,255,1)',
		shadow: 'rgba(51,51,255,0.4)',
		title: 'Percussive Organ',
		order: 0,
		sound: _tone_0170_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage('track2'), 0, 70, 100),
		nn: 2,
		octave: 4,
		volumeRatio: 0.6
	}, {
		color: 'rgba(0,153,0,1)',
		shadow: 'rgba(0,153,0,0.4)',
		title: 'Acoustic guitar',
		order: 6,
		sound: _tone_0250_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage('track1'), 0, 70, 100),
		nn: 1,
		octave: 3,
		volumeRatio: 0.75
	}, {
		color: 'rgba(255,0,0,1)',
		shadow: 'rgba(255,0,0,0.4)',
		title: 'Distortion guitar',
		order: 7,
		sound: _tone_0300_LesPaul_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage('track0'), 0, 70, 100),
		nn: 0,
		octave: 3,
		volumeRatio: 0.9
	}

];
