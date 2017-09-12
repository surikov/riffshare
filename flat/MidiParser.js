function MIDINote() {
	this.pitch = 0;
	this.instrument = 0;
	this.length = 1;
	this.glissando = 0;
	return this;
}
function MidiParser(arrayBuffer) {
	var me = this;
	// this.arrayBuffer=arrayBuffer;
	this.dataView = new DataView(arrayBuffer);
	this.counter = 0;
	this.programValues = [];
	this.programSteps = [];
	this.programChannels = [];
	this.notePitches = [];
	this.noteChannels = [];
	this.noteSteps = [];
	this.bendSizeA = [];
	this.bendSizeB = [];
	this.currentBend = [];
	this.maxLastStep = 0;
	this.lastStep = 0;
	this.limitImport = 3999;
	this.currentEventChannel = 0;
	this.songBeatSteps = [];
	this.songTuneSteps = [];
	//this.beatRiffs=[];
	this.parsedSong = null;
	var eventCount = 0;
	var eventCountStop = 150;

	this.predefinedDrums = [];
	this.predefinedDrums[35] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/001_035-035_60_-3500.0_8-16861_44100";
	this.predefinedDrums[36] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/002_036-036_60_-3600.0_8-6995_44100";
	this.predefinedDrums[37] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/003_037-037_60_-3700.0_8-3119_44100";
	this.predefinedDrums[38] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/004_038-038_60_-3800.0_8-17828_44100";
	this.predefinedDrums[39] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/005_039-039_60_-3900.0_8-25353_44100";
	this.predefinedDrums[40] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/006_040-040_60_-4000.0_8-14339_44100";
	this.predefinedDrums[41] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/007_041-041_60_-4100.0_8-48590_44100";
	this.predefinedDrums[42] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/059_042-042_60_-4200.0_8-6826_32000";
	this.predefinedDrums[43] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/008_043-043_60_-4300.0_8-48513_44100";
	this.predefinedDrums[44] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/060_044-044_60_-4400.0_8-2902_32000";
	this.predefinedDrums[45] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/010_045-045_60_-4500.0_8-50870_44100";
	this.predefinedDrums[46] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/061_046-046_60_-4600.0_8-34789_32000";
	this.predefinedDrums[47] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/011_047-047_60_-4700.0_8-48791_44100";
	this.predefinedDrums[48] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/012_048-048_60_-4800.0_8-37915_44100";
	this.predefinedDrums[49] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/014_049-049_60_-4900.0_8-120623_44100";
	this.predefinedDrums[50] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/013_050-050_60_-5000.0_8-30531_44100";
	this.predefinedDrums[51] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/015_051-051_60_-5100.0_8-93910_44100";
	this.predefinedDrums[52] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/016_052-052_60_-5200.0_8-77493_44100";
	this.predefinedDrums[53] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/017_053-053_60_-5300.0_8-99849_44100";
	this.predefinedDrums[54] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/019_054-054_60_-5400.0_8-8179_44100";
	this.predefinedDrums[55] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/020_055-055_60_-5500.0_8-57261_44100";
	this.predefinedDrums[56] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/021_056-056_60_-5600.0_8-2866_44100";
	this.predefinedDrums[57] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/022_057-057_60_-5700.0_8-109440_44100";
	this.predefinedDrums[58] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/023_058-058_60_-5800.0_8-66841_44100";
	this.predefinedDrums[59] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/024_059-059_60_-5900.0_8-90666_44100";
	this.predefinedDrums[60] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/025_060-060_60_-6000.0_8-3020_44100";
	this.predefinedDrums[61] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/026_061-061_60_-6100.0_8-4917_44100";
	this.predefinedDrums[62] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/027_062-062_60_-6200.0_8-7274_44100";
	this.predefinedDrums[63] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/028_063-063_60_-6300.0_8-6940_44100";
	this.predefinedDrums[64] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/030_064-064_60_-6400.0_8-25349_44100";
	this.predefinedDrums[65] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/031_065-065_60_-6500.0_8-21672_44100";
	this.predefinedDrums[66] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/032_066-066_60_-6600.0_8-30857_44100";
	this.predefinedDrums[67] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/033_067-067_60_-6700.0_8-4512_44100";
	this.predefinedDrums[68] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/034_068-068_60_-6800.0_8-5408_44100";
	this.predefinedDrums[69] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/035_069-069_60_-6900.0_8-7852_44100";
	this.predefinedDrums[70] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/036_070-070_60_-7000.0_8-1849_44100";
	this.predefinedDrums[71] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/037_071-071_60_-7100.0_8-3692_44100";
	this.predefinedDrums[72] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/038_072-072_60_-7200.0_8-15619_44100";
	this.predefinedDrums[73] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/039_073-073_60_-7300.0_8-2056_44100";
	this.predefinedDrums[74] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/041_074-074_60_-7400.0_8-13008_44100";
	this.predefinedDrums[75] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/058_075-075_60_-7500.0_8-2504_44100";
	this.predefinedDrums[76] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/042_076-076_60_-7600.0_8-4570_44100";
	this.predefinedDrums[77] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/043_077-077_60_-7700.0_8-4798_44100";
	this.predefinedDrums[78] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/044_078-078_60_-7800.0_8-9155_44100";
	this.predefinedDrums[79] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/045_079-079_60_-7900.0_8-12519_44100";
	this.predefinedDrums[80] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/046_080-080_60_-8000.0_8-7291_44100";
	this.predefinedDrums[81] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/047_081-081_60_-8100.0_8-55282_44100";
	this.predefinedDrums[81] = "http://molgav.nn.ru/sf/drums/000/Chaos_128/047_081-081_60_-8100.0_8-55282_44100";

	this.predefinedInstruments = [];
	this.predefinedInstruments[0] = "http://molgav.nn.ru/sf/instruments/000/Chaos_000/003_048-052_60_-5000_8-32231_22050";
	this.predefinedInstruments[1] = "http://molgav.nn.ru/sf/instruments/001/Chaos_000/004_053-057_60_-5500_8-57105_44100";
	this.predefinedInstruments[2] = "http://molgav.nn.ru/sf/instruments/002/Chaos_000/042_047-050_60_-6100_498-656_44100";
	this.predefinedInstruments[3] = "http://molgav.nn.ru/sf/instruments/003/Chaos_000/003_048-052_60_-5000_8-32231_22050";
	this.predefinedInstruments[4] = "http://molgav.nn.ru/sf/instruments/004/Chaos_000/000_000-064_60_-7000_1143-1238_44100";
	this.predefinedInstruments[5] = "http://molgav.nn.ru/sf/instruments/005/Chaos_000/000_000-066_60_-6800_2183-2288_44100";
	this.predefinedInstruments[6] = "http://molgav.nn.ru/sf/instruments/006/Chaos_000/001_048-055_60_-6400_508-645_44100";
	this.predefinedInstruments[7] = "http://molgav.nn.ru/sf/instruments/007/Chaos_000/002_049-055_60_-6000_824-991_44100";
	this.predefinedInstruments[8] = "http://molgav.nn.ru/sf/instruments/008/Chaos_000/000_000-096_60_-9100_4273-4440_44100";
	this.predefinedInstruments[9] = "http://molgav.nn.ru/sf/instruments/009/Chaos_000/000_000-098_60_-9400_5624-6074_44100";
	this.predefinedInstruments[10] = "http://molgav.nn.ru/sf/instruments/010/Chaos_000/000_000-096_60_-8900_2774-3053_44100";
	this.predefinedInstruments[11] = "http://molgav.nn.ru/sf/instruments/011/Chaos_000/000_000-069_60_-7500_860-929_44100";
	this.predefinedInstruments[12] = "http://molgav.nn.ru/sf/instruments/012/Chaos_000/000_000-054_60_-5800_1252-1437_44100";
	this.predefinedInstruments[13] = "http://molgav.nn.ru/sf/instruments/013/Chaos_000/000_000-098_60_-7900_889-944_44100";
	this.predefinedInstruments[14] = "http://molgav.nn.ru/sf/instruments/014/Chaos_000/000_000-108_60_-8600_4818-5471_44100";
	this.predefinedInstruments[15] = "http://molgav.nn.ru/sf/instruments/015/Chaos_000/000_000-088_60_-7900_3194-3250_44100";
	this.predefinedInstruments[16] = "http://molgav.nn.ru/sf/instruments/016/Chaos_000/000_000-054_60_-6800_50-262_44100";
	this.predefinedInstruments[17] = "http://molgav.nn.ru/sf/instruments/017/Chaos_000/000_000-080_60_-7800_1350-1472_44100";
	this.predefinedInstruments[18] = "http://molgav.nn.ru/sf/instruments/018/Chaos_000/002_044-055_60_-6700_8-41545_22050";
	this.predefinedInstruments[19] = "http://molgav.nn.ru/sf/instruments/019/Fluid_000/000_000-036_36_-3600_24522-61248_22050";
	this.predefinedInstruments[20] = "http://molgav.nn.ru/sf/instruments/020/Chaos_000/001_053-070_60_-7800_727-787_44100";
	this.predefinedInstruments[21] = "http://molgav.nn.ru/sf/instruments/021/Chaos_000/001_053-070_60_-7800_727-787_44100";
	this.predefinedInstruments[22] = "http://molgav.nn.ru/sf/instruments/022/Chaos_000/002_060-064_60_-7400_1023-1097_44100";
	this.predefinedInstruments[23] = "http://molgav.nn.ru/sf/instruments/023/Chaos_000/001_053-070_60_-7800_727-787_44100";
	this.predefinedInstruments[24] = "http://molgav.nn.ru/sf/instruments/024/Chaos_000/004_063-065_60_-7400_2109-2184_44100";
	this.predefinedInstruments[25] = "http://molgav.nn.ru/sf/instruments/025/Chaos_000/002_055-063_60_-5900_8-71799_22050";
	this.predefinedInstruments[26] = "http://molgav.nn.ru/sf/instruments/026/Chaos_000/001_045-049_60_-5600_5451-5664_44100";
	this.predefinedInstruments[27] = "http://molgav.nn.ru/sf/instruments/027/Chaos_000/002_060-063_60_-7200_1554-1639_44100";
	this.predefinedInstruments[28] = "http://molgav.nn.ru/sf/instruments/028/Chaos_000/002_055-127_60_-6000_8-1508_22050";
	//this.predefinedInstruments[29] = "http://molgav.nn.ru/sf/instruments/029/Fluid_000/000_000-043_60_-4000_245954-247023_22050";
	this.predefinedInstruments[29] = "http://molgav.nn.ru/sf/instruments/030/Kamac_000/005_050-051_60_-5000_15291-16040_22050";

	//this.predefinedInstruments[30] = "http://molgav.nn.ru/sf/instruments/030/Fluid_000/000_000-043_60_-4000_334593-336777_30000";
	this.predefinedInstruments[30] = "http://molgav.nn.ru/sf/instruments/030/Kamac_000/001_040-042_60_-4000_17910-18177_22050";

	this.predefinedInstruments[31] = "http://molgav.nn.ru/sf/instruments/031/Chaos_000/000_068-127_60_-6800_1085-1350_44100";
	this.predefinedInstruments[32] = "http://molgav.nn.ru/sf/instruments/032/Fluid_000/000_000-028_60_-2800_76560-78701_44100";
	this.predefinedInstruments[33] = "http://molgav.nn.ru/sf/instruments/033/SynthGMS_000/000_000-084_60_-6200_750-900_44100";
	this.predefinedInstruments[34] = "http://molgav.nn.ru/sf/instruments/034/Chaos_000/002_044-052_60_-4500_8655-9466_44100";
	this.predefinedInstruments[35] = "http://molgav.nn.ru/sf/instruments/035/Chaos_000/001_050-127_60_-5600_17100-17523_44100";
	this.predefinedInstruments[36] = "http://molgav.nn.ru/sf/instruments/036/Chaos_000/001_038-127_60_-4300_8-25976_44100";
	this.predefinedInstruments[37] = "http://molgav.nn.ru/sf/instruments/037/Chaos_000/001_038-127_60_-4300_8-25976_44100";
	this.predefinedInstruments[38] = "http://molgav.nn.ru/sf/instruments/038/Chaos_000/004_060-065_60_-6400_1995-2129_44100";
	this.predefinedInstruments[39] = "http://molgav.nn.ru/sf/instruments/039/Chaos_000/003_057-127_60_-5000_8-6721_22050";
	this.predefinedInstruments[40] = "http://molgav.nn.ru/sf/instruments/040/Chaos_000/001_061-066_60_-7400_1510-1585_44100";
	this.predefinedInstruments[41] = "http://molgav.nn.ru/sf/instruments/041/Chaos_000/001_059-065_60_-7400_1510-1585_44100";
	this.predefinedInstruments[42] = "http://molgav.nn.ru/sf/instruments/042/Chaos_000/000_061-073_60_-5800_1325-1514_44100";
	this.predefinedInstruments[43] = "http://molgav.nn.ru/sf/instruments/043/Chaos_000/000_060-073_60_-5400_5223-5461_44100";
	this.predefinedInstruments[44] = "http://molgav.nn.ru/sf/instruments/044/Chaos_000/002_058-063_60_-7000_5314-24115_44100";
	this.predefinedInstruments[45] = "http://molgav.nn.ru/sf/instruments/045/Chaos_000/000_000-068_60_-7500_3506-3577_44100";
	this.predefinedInstruments[46] = "http://molgav.nn.ru/sf/instruments/046/Chaos_000/001_049-051_60_-7700_529-592_44100";
	this.predefinedInstruments[47] = "http://molgav.nn.ru/sf/instruments/047/Chaos_000/001_045-127_60_-4800_8-26756_22050";
	this.predefinedInstruments[48] = "http://molgav.nn.ru/sf/instruments/048/Chaos_000/002_058-063_60_-7000_5314-24115_44100";
	this.predefinedInstruments[49] = "http://molgav.nn.ru/sf/instruments/049/Chaos_000/001_050-057_60_-6500_12249-26224_44100";
	this.predefinedInstruments[50] = "http://molgav.nn.ru/sf/instruments/050/Chaos_000/000_000-061_60_-6700_18-11263_44100";
	this.predefinedInstruments[51] = "http://molgav.nn.ru/sf/instruments/051/Chaos_000/004_000-061_60_-6700_18-11263_44100";
	this.predefinedInstruments[52] = "http://molgav.nn.ru/sf/instruments/052/Chaos_000/001_055-066_60_-6000_8-22252_22050";
	this.predefinedInstruments[53] = "http://molgav.nn.ru/sf/instruments/053/Chaos_000/002_057-061_60_-6700_1-4470_44100";
	this.predefinedInstruments[54] = "http://molgav.nn.ru/sf/instruments/054/Chaos_000/000_000-074_60_-7600_3-9947_44100";
	this.predefinedInstruments[55] = "http://molgav.nn.ru/sf/instruments/055/Chaos_000/001_000-127_60_-8800_8-34778_44100";
	this.predefinedInstruments[56] = "http://molgav.nn.ru/sf/instruments/056/Fluid_000/000_000-066_60_-6000_7185-18296_44100";
	this.predefinedInstruments[57] = "http://molgav.nn.ru/sf/instruments/057/Chaos_000/001_055-059_60_-6800_2440-2544_44100";
	this.predefinedInstruments[58] = "http://molgav.nn.ru/sf/instruments/058/Chaos_000/002_042-046_60_-5600_18971-25008_44100";
	this.predefinedInstruments[59] = "http://molgav.nn.ru/sf/instruments/059/Chaos_000/000_000-062_60_-6800_2460-2566_44100";
	this.predefinedInstruments[60] = "http://molgav.nn.ru/sf/instruments/060/Chaos_000/000_000-067_60_-7400_3338-3414_44100";
	this.predefinedInstruments[61] = "http://molgav.nn.ru/sf/instruments/061/Chaos_000/000_000-065_60_-7100_8434-28133_44100";
	this.predefinedInstruments[62] = "http://molgav.nn.ru/sf/instruments/062/Chaos_000/000_000-068_60_-6600_19-10715_44100";
	this.predefinedInstruments[63] = "http://molgav.nn.ru/sf/instruments/063/Chaos_000/000_000-067_60_-6600_19-10715_44100";
	this.predefinedInstruments[64] = "http://molgav.nn.ru/sf/instruments/064/Chaos_000/002_063-066_60_-7200_44934-52491_44100";
	this.predefinedInstruments[65] = "http://molgav.nn.ru/sf/instruments/065/Chaos_000/000_000-055_60_-4800_8-22996_22050";
	//this.predefinedInstruments[66] = "http://molgav.nn.ru/sf/instruments/066/Chaos_000/001_049-053_60_-5300_8-10836_22050";
	this.predefinedInstruments[66] = "http://molgav.nn.ru/sf/instruments/066/Fluid_000/000_000-047_60_-4700_52484-59757_32000";
	
	
	
	this.predefinedInstruments[67] = "http://molgav.nn.ru/sf/instruments/067/Chaos_000/003_049-052_60_-6200_1222-1372_44100";
	this.predefinedInstruments[68] = "http://molgav.nn.ru/sf/instruments/068/Chaos_000/000_000-062_60_-6900_3336-3437_44100";
	this.predefinedInstruments[69] = "http://molgav.nn.ru/sf/instruments/069/Chaos_000/001_055-058_60_-6800_1026-1130_44100";
	this.predefinedInstruments[70] = "http://molgav.nn.ru/sf/instruments/070/Chaos_000/002_051-054_60_-6300_893-1034_44100";
	this.predefinedInstruments[71] = "http://molgav.nn.ru/sf/instruments/071/Chaos_000/001_050-055_60_-5700_1891-2094_44100";
	this.predefinedInstruments[72] = "http://molgav.nn.ru/sf/instruments/072/Chaos_000/000_000-088_60_-9000_782-811_44100";
	this.predefinedInstruments[73] = "http://molgav.nn.ru/sf/instruments/073/Chaos_000/000_000-070_60_-7700_1418-1480_44100";
	this.predefinedInstruments[74] = "http://molgav.nn.ru/sf/instruments/074/Chaos_000/000_000-096_60_-8000_1683-1736_44100";
	this.predefinedInstruments[75] = "http://molgav.nn.ru/sf/instruments/075/Chaos_000/000_053-076_60_-7700_1570-8382_44100";
	this.predefinedInstruments[76] = "http://molgav.nn.ru/sf/instruments/076/Chaos_000/000_000-100_60_-7700_4207-10523_44100";
	this.predefinedInstruments[77] = "http://molgav.nn.ru/sf/instruments/077/Chaos_000/000_000-108_60_-8900_3174-3206_44100";
	this.predefinedInstruments[78] = "http://molgav.nn.ru/sf/instruments/078/Chaos_000/000_000-108_60_-8800_156-190_44100";
	this.predefinedInstruments[79] = "http://molgav.nn.ru/sf/instruments/079/Chaos_000/000_000-108_60_-8800_156-190_44100";
	this.predefinedInstruments[80] = "http://molgav.nn.ru/sf/instruments/080/Chaos_000/000_000-064_60_-6900_8-14597_32000";
	this.predefinedInstruments[81] = "http://molgav.nn.ru/sf/instruments/081/Chaos_000/000_000-068_60_-6700_8-13481_32000";
	this.predefinedInstruments[82] = "http://molgav.nn.ru/sf/instruments/082/Chaos_000/001_051-062_60_-7100_16118-44026_44100";
	this.predefinedInstruments[83] = "http://molgav.nn.ru/sf/instruments/083/Chaos_000/000_000-076_60_-7700_1570-8382_44100";
	this.predefinedInstruments[84] = "http://molgav.nn.ru/sf/instruments/084/Chaos_000/004_053-057_60_-5500_8-96417_22050";
	this.predefinedInstruments[85] = "http://molgav.nn.ru/sf/instruments/085/Chaos_000/000_000-108_60_-9800_129-5427_44100";
	this.predefinedInstruments[86] = "http://molgav.nn.ru/sf/instruments/086/Chaos_000/000_000-091_60_-8400_4609-13118_44100";
	this.predefinedInstruments[87] = "http://molgav.nn.ru/sf/instruments/087/Chaos_000/002_055-065_60_-6400_1995-2129_44100";
	this.predefinedInstruments[88] = "http://molgav.nn.ru/sf/instruments/088/Chaos_000/002_000-078_60_-8400_4609-13118_44100";
	this.predefinedInstruments[89] = "http://molgav.nn.ru/sf/instruments/089/Chaos_000/000_000-084_60_-8400_4609-13118_44100";
	this.predefinedInstruments[90] = "http://molgav.nn.ru/sf/instruments/090/Chaos_000/000_000-091_60_-8400_4609-13118_44100";
	this.predefinedInstruments[91] = "http://molgav.nn.ru/sf/instruments/091/Chaos_000/000_000-108_60_-9500_26-4870_44100";
	this.predefinedInstruments[92] = "http://molgav.nn.ru/sf/instruments/092/Chaos_000/000_000-108_60_-9500_26-4870_44100";
	this.predefinedInstruments[93] = "http://molgav.nn.ru/sf/instruments/093/Chaos_000/002_060-063_60_-7200_1554-1639_44100";
	this.predefinedInstruments[94] = "http://molgav.nn.ru/sf/instruments/094/Chaos_000/000_000-090_60_-7600_3-9947_44100";
	this.predefinedInstruments[95] = "http://molgav.nn.ru/sf/instruments/095/Chaos_000/000_000-091_60_-8400_4609-13118_44100";
	this.predefinedInstruments[96] = "http://molgav.nn.ru/sf/instruments/096/Chaos_000/000_000-091_60_-8400_4609-13118_44100";
	this.predefinedInstruments[97] = "http://molgav.nn.ru/sf/instruments/097/Chaos_000/000_000-084_60_-7700_4609-13118_44100";
	this.predefinedInstruments[98] = "http://molgav.nn.ru/sf/instruments/098/Chaos_000/000_000-084_60_-9100_4273-4440_44100";
	this.predefinedInstruments[99] = "http://molgav.nn.ru/sf/instruments/099/Chaos_000/000_000-091_60_-8400_4609-13118_44100";
	this.predefinedInstruments[100] = "http://molgav.nn.ru/sf/instruments/100/Chaos_000/000_000-108_60_-9800_129-5427_44100";
	this.predefinedInstruments[101] = "http://molgav.nn.ru/sf/instruments/101/Chaos_000/000_000-090_60_-7600_3-9947_44100";
	this.predefinedInstruments[102] = "http://molgav.nn.ru/sf/instruments/102/Chaos_000/001_068-073_60_-8100_4-6974_44100";
	this.predefinedInstruments[103] = "http://molgav.nn.ru/sf/instruments/103/Chaos_000/001_048-059_60_-6400_1530-1665_44100";
	this.predefinedInstruments[104] = "http://molgav.nn.ru/sf/instruments/104/Chaos_000/000_000-084_60_-7400_1488-1562_44100";
	this.predefinedInstruments[105] = "http://molgav.nn.ru/sf/instruments/105/Chaos_000/000_000-063_60_-6900_2095-2196_44100";
	this.predefinedInstruments[106] = "http://molgav.nn.ru/sf/instruments/106/Chaos_000/001_056-060_60_-7000_1102-1197_44100";
	this.predefinedInstruments[107] = "http://molgav.nn.ru/sf/instruments/107/Chaos_000/001_062-066_60_-7300_1016-1094_44100";
	this.predefinedInstruments[108] = "http://molgav.nn.ru/sf/instruments/108/Chaos_000/000_000-084_60_-7200_2024-2192_44100";
	this.predefinedInstruments[109] = "http://molgav.nn.ru/sf/instruments/109/Chaos_000/001_058-084_60_-7900_976-1033_44100";
	this.predefinedInstruments[110] = "http://molgav.nn.ru/sf/instruments/110/Chaos_000/000_000-060_60_-7000_1205-1299_44100";
	this.predefinedInstruments[111] = "http://molgav.nn.ru/sf/instruments/111/Chaos_000/001_055-056_60_-6800_1026-1130_44100";
	this.predefinedInstruments[112] = "http://molgav.nn.ru/sf/instruments/112/Chaos_000/000_000-127_60_-10700_3438-4116_44100";
	this.predefinedInstruments[113] = "http://molgav.nn.ru/sf/instruments/113/Chaos_000/000_000-108_60_-8400_2123-2289_44100";
	this.predefinedInstruments[114] = "http://molgav.nn.ru/sf/instruments/114/Chaos_000/000_000-089_60_-7600_4661-4791_44100";
	this.predefinedInstruments[115] = "http://molgav.nn.ru/sf/instruments/115/Chaos_000/000_000-127_60_-9200_3-844_44100";
	this.predefinedInstruments[116] = "http://molgav.nn.ru/sf/instruments/116/Chaos_000/000_000-108_60_-8200_1799-3399_44100";
	this.predefinedInstruments[117] = "http://molgav.nn.ru/sf/instruments/117/Chaos_000/000_000-127_60_-6000_8-25332_44100";
	this.predefinedInstruments[118] = "http://molgav.nn.ru/sf/instruments/118/Chaos_000/000_000-108_60_-10300_1230-1313_44100";
	this.predefinedInstruments[119] = "http://molgav.nn.ru/sf/instruments/119/Chaos_000/000_000-127_60_-6000_3807-12024_44100";
	this.predefinedInstruments[120] = "http://molgav.nn.ru/sf/instruments/120/Chaos_000/000_000-108_60_-7500_3-3409_44100";
	this.predefinedInstruments[121] = "http://molgav.nn.ru/sf/instruments/121/Chaos_000/000_000-076_60_-7700_1570-8382_44100";
	this.predefinedInstruments[122] = "http://molgav.nn.ru/sf/instruments/122/Chaos_000/000_000-108_60_-8300_6-14020_44100";
	this.predefinedInstruments[123] = "http://molgav.nn.ru/sf/instruments/123/Chaos_000/000_000-127_60_-6000_8-62283_44100";
	this.predefinedInstruments[124] = "http://molgav.nn.ru/sf/instruments/124/Chaos_000/000_000-127_68_-6755_32-1537_22050";
	this.predefinedInstruments[125] = "http://molgav.nn.ru/sf/instruments/125/Chaos_000/000_000-108_60_-8800_3-4157_44100";
	this.predefinedInstruments[126] = "http://molgav.nn.ru/sf/instruments/126/Chaos_000/000_000-127_60_-8500_9-8682_44100";
	this.predefinedInstruments[127] = "http://molgav.nn.ru/sf/instruments/127/Chaos_000/000_000-108_60_-8200_3-10413_44100";

	this.parse = function (padStart, riffSize, tmp) {

		console.log("MidiParser.parse", padStart, riffSize, tmp);
		me.counter = 8;
		var fileFormat = me.read2BigEndian();
		console.log("fileFormat: " + fileFormat);
		var trackCount = me.read2BigEndian();
		console.log("trackCount: " + trackCount);
		me.ticksPerQuarter = me.read2BigEndian();
		console.log("ticksPerQuarter: " + me.ticksPerQuarter);
		me.tempo = 60000000.0 / (960.0 * me.ticksPerQuarter);
		console.log("tempo: " + me.tempo);
		me.programValues = [];
		me.programSteps = [];
		me.programChannels = [];
		me.notePitches = [];
		me.noteChannels = [];
		me.noteSteps = [];
		me.bendSizeA = [];
		me.bendSizeB = [];
		me.currentBend = [];
		var i = 0;
		me.songTuneSteps = [];
		me.songBeatSteps = [];
		for (i = 0; i < 16; i++) {
			me.bendSizeA[i] = 0;
			me.bendSizeB[i] = 0;
			me.currentBend[i] = 0;
		}
		me.maxLastStep = 0;
		for (i = 0; i < trackCount; i++) {
			me.parseTrack();
		}
		console.log("maxLastStep " + me.maxLastStep);
		// maxLastStep = limitImport;
		// songData.noteCount = maxLastStep;
		//me.dumpSong();
/*
		me.extractRiffs(padStart, riffSize);

		me.parsedSong.zoom = app.song.zoom;
		me.parsedSong.zoomPosition = app.song.zoomPosition;
		me.parsedSong.meter = app.song.meter;
		me.parsedSong.tempo = app.song.tempo;
		//upDrums(me.parsedSong);
		app.song = me.parsedSong;
		app.renderer.refreshSong();
		console.log(app.song);
		*/
	};
	/*this.upDrums=function(){
	};*/
	this.getBlock8 = function (n8) {
		var block = [];
		for (var i = n8; i < n8 + 8 && i < me.songTuneSteps.length; i++) {
			block.push(me.songTuneSteps[i]);
		}
		for (var i = block.length; i < 8; i++) {
			block.push([]);
		}
		return block;
	};
	this.existsMidiNote = function (one, all) {
		for (var i = 0; i < all.length; i++) {
			var cu = all[i];
			if (cu.pitch == one.pitch &&
				cu.instrument == one.instrument) {
				return true;
			}
		}
		return false;
	};
	this.block8equals = function (b1, b2) {
		var countNotes = 0;
		var countOverlap = 0;
		for (var i = 0; i < 8; i++) {
			s1 = b1[i];
			s2 = b2[i];
			var instruments = [];
			//for(var i=0;i<
			for (var n1 = 0; n1 < s1.length; n1++) {
				var midiNote1 = s1[n1];
				countNotes++;
				if (this.existsMidiNote(midiNote1, s2)) {
					countOverlap++;
				}
			}
			for (var n2 = 0; n2 < s2.length; n2++) {
				var midiNote2 = s2[n2];
				countNotes++;
				if (this.existsMidiNote(midiNote2, s1)) {
					countOverlap++;
				}
			}
		}
		var ratio = 1;
		if (countNotes > 0) {
			ratio = countOverlap / countNotes;
		}
		//console.log(ratio,countOverlap,countNotes);
		if (ratio > 0.5) {
			return true;
		} else {
			return false;
		}
	}

	this.block8equalsTo = function (block8, to) {}

	this.findBlockIndex = function (b8, blocks) {
		if (!this.empty8(b8)) {
			for (var i = 0; i < blocks.length; i++) {
				if (me.block8equals(b8, blocks[i])) {
					return i;
				}
			}
		}
		blocks.push(b8);
		return blocks.length - 1;
	};
	this.empty8 = function (b8) {
		for (var i = 0; i < b8.length; i++) {
			if (b8[i].length > 0) {
				return false;
			}
		}
		return true;
	};
	this.split8 = function () {
		console.log("steps---------------");
		//console.log(me.songTuneSteps.length);
		var blocks = [];
		var indexes = [];
		for (var i = 0; i < me.songTuneSteps.length / 8; i++) {
			var b8 = me.getBlock8(i * 8);
			var idx = me.findBlockIndex(b8, blocks);
			indexes.push(idx);
			//if(i<5)console.log(b8);
			//console.log("/" + idx);
		}
		//console.log(indexes,blocks.length, indexes.length, me.songTuneSteps.length);

		var str = "";
		for (var i = 0; i < indexes.length; i++) {
			str = str + "," + indexes[i];
		}
		console.log('blocks', str);
		var pa = new PatternArray(indexes);
		//console.log('longest', pa.longest.pattern, '		', pa.longest.positions);
		/*var b1=me.getBlock8(32+8*0);
		var b2=me.getBlock8(32+8*1);
		var b3=me.getBlock8(32+8*2);
		var b4=me.getBlock8(32+8*3);
		var b5=me.getBlock8(32+8*4);
		me.block8equals(b1,b2);*/
		console.log('-----------');
		return pa;
	};

	//----------9999999999999999999999999999999999999999999999999
	function existstInDictionary(name, dictionary) {
		for (var i = 0; i < dictionary.length; i++) {
			if (dictionary[i].name == name) {
				return true;
			}
		}
		return false;
	}
	function addToDictionary(it, dictionary, textArray) {

		var pos = [];
		for (var i = 0; i < textArray.length; i++) {
			if (textArray[i] == it) {
				pos.push(i);
			}
		}
		dictionary.push({
			name : it,
			positions : pos
		});
		/*if(pos.length>1){
		var pr=[];
		for(var p1=0;p1<pos.length-1;p1++){
		for(var p2=p1+1;p2<pos.length && pos[p2]+(pos[p2]-pos[p1])<textArray.length;p2++){
		pr.push({
		first:pos[p1],second:pos[p2]
		});
		}
		}
		if(pr.length>0){
		//console.log('before',pr);
		pr.sort(function(a,b){
		var aLen=1000*(a.second-a.first)-a.first;
		var bLen=1000*(b.second-b.first)-b.first;
		var d=bLen-aLen;
		//console.log('d',d);
		return d;
		});
		//console.log('after',pr);
		dictionary.push({
		name:it,positions:pos,pairs:pr
		});
		}
		}*/
	}

	function createDictionary(textArr) {
		var di = [];
		for (var i = 0; i < textArr.length; i++) {
			if (!existstInDictionary(textArr[i], di)) {
				addToDictionary(textArr[i], di, textArr);
			}
		}
		return di;
	}
	function findPosition(from, num, positions) {
		//console.log('findPosition',from,num);
		for (var i = from; i < positions.length; i++) {
			if (positions[i] == num) {
				return i;
			}
		}
		return -1;
	}
	function addAFoursome(len, it, positions, f) {
		//console.log('addAFoursome',len,name,positions,f);
		for (var i = 0; i < positions.length - 3; i++) {
			//console.log('i',i);
			//var p1=positions[i];
			//console.log('p1',p1);
			var p2 = findPosition(i + 1, positions[i] + 1 * len, positions);
			//console.log('p2',p2);
			if (p2 > -1) {
				var p3 = findPosition(i + 2, positions[i] + 2 * len, positions);
				//console.log('p3',p3);
				if (p3 > -1) {
					var p4 = findPosition(i + 3, positions[i] + 3 * len, positions);
					//console.log('p4',p4);
					if (p4 > -1) {
						//if(it==0){console.log('push',it,'from',positions[i],'size',len);}
						f.push({
							name : it,
							start : positions[i],
							interval : len
						});
						//console.log('addAFoursome',f);
					}
				}
			}
		}
	}
	function addFoursomes(mx, name, positions, f) {

		for (var n = 1; n < mx; n++) {
			addAFoursome(n, name, positions, f);
		}
	}
	function createFoursomes(dictionary) {
		var f = [];
		for (var i = 0; i < dictionary.length; i++) {
			//console.log(i,dictionary[i]);
			var mx = Math.ceil(dictionary[i].positions[dictionary[i].positions.length - 1] - dictionary[i].positions[0]);
			addFoursomes(mx, dictionary[i].name, dictionary[i].positions, f);
		}
		/*f.sort(function(f1,f2){
		return (1000*f1.start-f1.interval)-(1000*f2.start-f2.interval);
		});
		var l=f.splice();
		l.sort(function(f1,f2){
		return (1000*f1.start-f1.interval)-(1000*f2.start-f2.interval);
		});
		console.log(f);*/
		return f;
	}
	function findFoursome(start, name, interval, foursomes) {
		for (var s = 0; s < foursomes.length; s++) {
			if (foursomes[s].name == name && foursomes[s].start == start && foursomes[s].interval == interval) {
				//console.log(i,foursomes[s].name,foursomes[s].interval);
				return foursomes[s];
			}
		}
		return null;
	}
	function findNextFoursome(start, name, skipInterval, foursomes) {
		for (var s = 0; s < foursomes.length; s++) {
			if (foursomes[s].name == name && foursomes[s].start == start && foursomes[s].interval < skipInterval) {
				return foursomes[s];
			}
		}
		return null;
	}
	function findFirstFoursome(start, name, foursomes) {
		for (var s = 0; s < foursomes.length; s++) {
			if (foursomes[s].name == name && foursomes[s].start == start) {
				return foursomes[s];
			}
		}
		return null;
	}
	function fillSplits2(foursomes, textArray) {
		var splits = [];
		for (var i = 0; i < textArray.length; i++) {
			var cu = findFirstFoursome(i, textArray[i], foursomes);
			while (cu != null) {
				var txt = '';
				var overlapCounter = 0;
				for (var n = 0; n < cu.interval - 1; n++) {
					var nx = findFoursome(i + n + 1, textArray[i + n + 1], cu.interval, foursomes);
					if (nx != null) {
						txt = '' + txt + '' + textArray[i + n + 1];
						overlapCounter++;
					} else {
						txt = txt + '*';
					}
				}
				var ratio = overlapCounter / (cu.interval - 1);
				if (ratio > 0.75) {
					console.log('ratio', ratio, 'riff', textArray[i], 'txt', txt, cu);
					if (i > 0) {
						splits.push(i * 8);
					}
					i = i + cu.interval * 4 - 1;
					break;
				} else {
					cu = findNextFoursome(i, textArray[i], cu.interval, foursomes);
				}
			}
		}
		return splits;
	}
	function fillSplits(foursomes, textArray) {
		console.log('textArray', textArray);
		var splits = [];
		//var riffs=[];
		foursomes.sort(function (f1, f2) {
			return (1000 * f2.interval - f2.start) - (1000 * f1.interval - f1.start);
			//return (1000*f1.start-f1.interval)-(1000*f2.start-f2.interval);
		});
		console.log('foursomes', foursomes);
		//var mx=0;
		if (foursomes.length > 0) {
			//mx=foursomes[0].interval;
			var current = foursomes[i];
			var counter = 0;
			for (var i = 1; i < foursomes.length; i++) {
				console.log('current', current);
				for (var n = 0; n < foursomes.length; n++) {
					//if(
					console.log(n, 'next', current.star);
				}
				//if(foursomes[i].interval<mx){
				//splits.push(8*(foursomes[i].start));
				//splits.push(8*(foursomes[i].start+foursomes[i].interval*4));
				//console.log(foursomes[i]);
				//}
				break;
			}
		}
		//console.log('riffs',riffs);
		console.log('splits', splits);
		return splits;
	}
	//----------9999999999999999999999999999999999999999999999999
	function splitByDictionary(dictionary, indexes) {
		console.log('splitByDictionary', dictionary);
		console.log('indexes', indexes);
		/*dictionary.sort(function(f1,f2){
		return
		return (f1.pairs[0].second-f1.pairs[0].first)-(f2.pairs[0].second-f2.pairs[0].first);
		//return (1000*f1.start-f1.interval)-(1000*f2.start-f2.interval);
		});
		console.log('splitByDictionary 2',dictionary);*/
		/*var pairs=[];
		for(var i=0;i<dictionary.length;i++){
		//console.log(i,' ',dictionary[i]);
		for(var p=0;p<dictionary[i].pairs.length;p++){
		//if(dictionary[i].pairs[p].second-dictionary[i].pairs[p].first>1){
		pairs.push({
		name:dictionary[i].name
	,pair:dictionary[i].pairs[p]
		}
		);
		//}
		}
		}
		pairs.sort(function(f1,f2){
		return (f2.pair.second-f2.pair.first)-(f1.pair.second-f1.pair.first);
		});
		console.log('pairs',pairs);
		if(pairs.length>0){
		var counter=0;
		for(var i=0;i<pairs.length-1 && counter<400;i++){
		var pair=pairs[i];
		var len=pair.pair.second-pair.pair.first;
		//console.log(i,'current',pair.name,len,pair);
		//var exists=false;
		for(var n=1;n<len;n++){
		//console.log('seek',n);
		for(var k=0;k<pairs.length;k++){
		if(pairs[k].first==pair.pair.first+n && pairs[k].second-pairs[k].first==pair.pair.second-pair.pair.first){
		console.log('found',pairs[k],'for',pair);
		break;
		}
		}
		}
		//if(ok){
		//console.log(i,pair);
		counter++;
		//}
		}

		}*/
		var splits = [];
		var intervals = [];
		for (var i = 0; i < dictionary.length; i++) {
			var pos = dictionary[i].positions;
			for (var p1 = 0; p1 < pos.length - 1; p1++) {
				for (var p2 = p1 + 1; p2 < pos.length; p2++) {
					var sz = pos[p2] - pos[p1];
					if (sz > 3 && sz < 50) {
						intervals.push({
							name : dictionary[i].name,
							start : pos[p1],
							size : sz
						});
					}
				}
			}
		}
		intervals.sort(function (f1, f2) {
			return (f2.size * 1000 - f2.start) - (f1.size * 1000 - f1.start);
		});
		var occupied = [];
		//var s=0;
		//while(s<intervals.length){
		//console.log('intervals.size',intervals.size);
		for (var s = 0; s < intervals.length && occupied.length<16; s++) {
			var first = intervals[s];
			var valid = true;
			//console.log('first',first);
			for (var o = 0; o < occupied.length; o++) {
				if (!(first.start >= occupied[o].start + occupied[o].size * 2 || first.start + 2 * first.size < occupied[o].start)) {
					valid = false;
					break;
				}
			}
			if (valid) {
				//console.log('first',first);
				var matching = 0;
				for (var i = 1; i < first.size; i++) {
					if (s + i >= intervals.length) {
						break;
					}
					var current = intervals[s + i];
					//console.log('current',current);
					if (current.start > first.start + i || current.size < first.size) {
						break;
					}
					if (current.start == first.start + i && current.size == first.size) {
						matching++;
						//console.log('matching',matching);
					}
				}
				var ratio = (matching + 1) / first.size;
				if (ratio > 4 / 5) {
					//console.log('found',first);
					occupied.push(first);
					//splits.push(first.start*8);
					//splits.push((first.start+first.size)*8);
					//splits.push((first.start+2*first.size)*8);
					//break;
				} //else{
				//console.log('wrong',first,ratio);
				//s++;
				//}
			}
		}
		for(var i=0;i<occupied.length;i++){
			var first=occupied[i];
			splits.push(first.start*8);
			//splits.push((first.start+2*first.size)*8);
			/*
			
			if(first.start>0){
				splits.push(first.start*8);
				}
			var lst=(first.start+2*first.size)*8;
			if(splits.length>1){
				if(splits[splits.length]<lst){
					splits.push(lst);
				}
			}else{
				splits.push(lst);
			}
			*/
			//splits.push((first.start+first.size)*8);
			/*if(i<occupied.length-1){
				var nx=occupied[i+1];
				if(first.start+2*first.size<nx.start){
					splits.push((first.start+2*first.size)*8);
				}
			}
			else{
				splits.push((first.start+2*first.size)*8);
			}*/
		}
		console.log('intervals', intervals);
		console.log('occupied', occupied);
		//var splits = [];
		return splits;
	}

	this.extractRiffs = function (padStart, riffSize) {
		//var patternArray = me.split8();
		me.parsedSong = new Song();
		//var padStart = 0;
		//var riffSize = 64;
		me.parsedSong.meter = riffSize;
		me.sureTuneStep(me.maxLastStep + riffSize);
		me.sureBeatStep(me.maxLastStep + riffSize);
		//console.log("extractRiffs");

		/*for (var i = 0; i < padStart; i++) {
		me.songBeatSteps.splice(0, 0, []);
		me.songTuneSteps.splice(0, 0, []);
		}

		me.maxLastStep = me.maxLastStep + padStart;
		//console.log(me.maxLastStep);
		var slotCount = Math.floor((me.maxLastStep - 1) / riffSize) + 1;
		me.maxLastStep = slotCount * riffSize;
		console.log("slotCount " + slotCount);
		me.sureTuneStep(me.maxLastStep);
		me.sureBeatStep(me.maxLastStep);
		//for(var i=0;i<3;i++){
		 */
		/*
		patternArray.patterns.sort(function (o1, o2) {
		//return o1.positions[0] - o2.positions[0];
		//return o2.pattern.length - o1.pattern.length;
		var r1=o1.pattern.length;
		var r2=o2.pattern.length;
		if(r1*8>=riffSize*1 && r1*8<=riffSize*2){
		r1=r1*0.001;
		}
		if(r2*8>=riffSize*1 && r2*8<=riffSize*2){
		r2=r2*0.001;
		}
		return r2-r1;
		});
		console.log('len', me.maxLastStep, patternArray);*/
		//var occuped = [];


		//var splits = [];

		var blocks = [];
		var indexes = [];
		for (var i = 0; i < me.songTuneSteps.length / 8; i++) {
			var b8 = me.getBlock8(i * 8);
			var idx = me.findBlockIndex(b8, blocks);
			indexes.push(idx);
			//if(i<5)console.log(b8);
			//console.log("/" + idx);
		}
		//console.log('blocks',blocks);
		//console.log('indexes',indexes);
		var dictionary = createDictionary(indexes);

		var splits = splitByDictionary(dictionary, indexes);
		//var fs=createFoursomes(dictionary);
		//console.log('fs',fs);
		//var splits=fillSplits(fs,indexes);

		//console.log('splits',splits);

		/*for (var t = 0; t < patternArray.patterns.length; t++) {
		//if(patternArray.patterns[t].positions[0]>=riffSize){
		occuped.push(patternArray.patterns[t]);
		//splits.push(patternArray.patterns[0].positions[0] * 8);
		for (var i = 0; i < patternArray.patterns[t].positions.length; i++) {
		splits.push(patternArray.patterns[t].positions[i] * 8);
		//splits.push(patternArray.patterns[t].positions[i] * 8+patternArray.patterns[t].pattern.length * 8);
		//nn = nn + splits[splits.length-1];
		}
		console.log('first pattern',t, patternArray.patterns[t]);
		break;
		//}
		}*/
		/*patternArray.patterns.sort(function (o1, o2) {
		//return o1.positions[0] - o2.positions[0];
		return o2.pattern.length - o1.pattern.length;
		});*/
		/*
		patternArray.patterns.sort(function (o1, o2) {
		return o2.pattern.length - o1.pattern.length
		});*/
		//var sorted = patternArray.patterns[0];
		//console.log('sorted', patternArray.patterns);


		//splits.push(48);
		//splits.push(48+128);
		//splits.push(48+128+80);
		//var nn = 0;
		//var occuped = [];

		/*
		for (var t = 0; t < patternArray.patterns.length; t++) {
		var curPattern = patternArray.patterns[t];
		if( curPattern.positions[0]*8>=riffSize){
		var exists = false;
		for (var k = 0; k < occuped.length; k++) {
		var exPattern = occuped[k];
		for (var c = 0; c < curPattern.positions.length; c++) {
		var cuPosition = curPattern.positions[c];
		var cuLen = curPattern.pattern.length;
		for (var e = 0; e < exPattern.positions.length; e++) {
		var exPosition = exPattern.positions[e];
		//console.log(e,exPattern.positions,exPosition);
		var exLen = exPattern.pattern.length;
		if (//
		(!(cuPosition >= exPosition + exLen +riffSize|| cuPosition + cuLen < exPosition))//
		) {
		exists = true;
		break;
		}
		}
		if (exists) {
		break;
		}
		}
		if (exists) {
		break;
		}
		}
		if (!exists) {
		occuped.push(curPattern);
		console.log('add pattern',t,curPattern);
		for (var i = 0; i < curPattern.positions.length; i++) {
		splits.push(curPattern.positions[i] * 8);
		//splits.push(curPattern.positions[i] * 8+curPattern.pattern.length * 8);
		//nn = nn + splits[splits.length-1];
		}
		}
		}
		}*/
		splits.push(0);
		splits.sort(function (o1, o2) {
			return o1 - o2;
		});
		console.log('add split', splits);
		//splits.push(me.maxLastStep - nn);*/
		var currentStep = 0;
		var xx = 0;
		var yy = 0;
		splits.push(me.maxLastStep + riffSize);
		
		for (var i = 0; i < splits.length; i++) {

			var splitCounter = splits[i] - currentStep;
			console.log('split', i, 'at', currentStep, 'size', splitCounter);
			if(splitCounter>0){
				while (splitCounter > riffSize) {
					this.parseSlot(currentStep, riffSize, riffSize, xx, yy);
					xx++;
					currentStep = currentStep + riffSize;
					splitCounter = splitCounter - riffSize;
				}
				if (splitCounter > 0) {
					this.parseSlot(currentStep, splitCounter, riffSize, xx, yy);
					currentStep = currentStep + splitCounter;
				}
				if (i > 0) {
					yy++;
					xx = 0;
				}
			}else{
				console.log('skip');
			}
		}
		/*
		var nn = 0;
		while (nn < me.maxLastStep) {
		//for (var i = 0; i < 50; i++) {
		var o = {};
		o.len = riffSize;
		o.nxt = false;
		console.log(nn,o.len);
		//if (((splits.length + 1) % 7.0) == 0) {
		if (nn > 0) {
		for(var i=0;i<patternArray.longest.positions.length;i++){
		console.log(nn,patternArray.longest.positions[i]);
		if(patternArray.longest.positions[i]==nn){
		o.nxt = true;
		}
		}
		}
		//}
		splits.push(o);
		nn = nn + riffSize;
		}
		 */

		//splits[2].len = 280;
		//splits[2].nxt = true;
		//splits[1].len = 116;
		//splits[4].nxt = true;
		//console.log("me.maxLastStep",me.maxLastStep);
		/*var len = 0;
		for (var i = 0; i < splits.length; i++) {
		len = len + splits[i].len;
		}
		console.log('len', len);*/
		/*me.sureTuneStep(len);
		me.sureBeatStep(len);*/
		/*var counter = 0;
		var xx = 0;
		var yy = 0;
		for (var i = 0; i < splits.length; i++) {
		console.log(counter);
		//console.log(splits[i]);
		//console.log(splits[i].len);
		if (splits[i].nxt ) {
		console.log('counter for split',counter);
		yy++;
		xx = 0;
		}
		if (splits[i].len <= riffSize) {
		this.parseSlot(counter, splits[i].len, riffSize, xx, yy);
		counter = counter + splits[i].len;
		} else {
		var m = 1;
		while (m < splits[i].len) {

		this.parseSlot(counter, riffSize, riffSize, xx, yy);
		counter = counter + riffSize;
		m = m + riffSize;
		xx++;
		//yy++;
		}
		var os = splits[i].len - m + riffSize;
		console.log('os', os);
		this.parseSlot(counter, os, riffSize, xx, yy);
		counter = counter + os;
		}
		xx++;
		}*/
		/*for (var i = 0; i < slotCount; i++) {
		this.parseSlot(i, riffSize);
		}*/
		//me.dumpBeatRiffs();
		//toolbox.dumpSong(me.parsedSong);
		console.log("riffs.length " + me.parsedSong.riffs.length);
		toolbox.sortSamples(me.parsedSong);
		/*for(var i=0;i<me.parsedSong.samples.length;i++){
		console.log(me.parsedSong.samples[i].path);
		}*/
	};
	this.parseSlot = function (skipSteps, riffSize, meter, px, py) {
		//console.log('skipSteps',skipSteps,'riffSize',riffSize,'meter',meter,'px',px,'py',py);
		var songPosition = toolbox.getPositionFromSong(px, py, me.parsedSong);
		if (riffSize < meter) {
			songPosition.length = riffSize;
		}
		me.parseSlotBeat(skipSteps, riffSize, meter, songPosition);
		me.parseSlotTunes(skipSteps, riffSize, meter, songPosition);
	};
	this.parseSlot2 = function (nn, riffSize) {
		//console.log("parseSlot: "+nn);
		/*
		for (var i = 0; i < nn; i++) {
		var xx = i % 4;
		var yy = Math.floor(i / 4);
		toolbox.getPositionFromSong(xx, yy, me.parsedSong);
		}*/
		var xx = nn % 4;
		var yy = Math.floor(nn / 4);
		var songPosition = toolbox.getPositionFromSong(xx, yy, me.parsedSong);

		me.parseSlotBeat(nn, riffSize, songPosition);
		me.parseSlotTunes(nn, riffSize, songPosition);
	};
	this.parseSlotBeat = function (nn, riffSize, meter, songPosition) {
		//console.log("parseSlotBeat: "+nn);
		var riff = new SongRiff();
		for (var i = 0; i < riffSize; i++) {
			var chordBeat = me.songBeatSteps[i + nn]; // * riffSize];
			if (!chordBeat) {
				chordBeat = [];
				me.songBeatSteps[i + nn] = chordBeat;
			}
			//console.log(i,nn,chordBeat);
			for (var t = 0; t < chordBeat.length; t++) {
				var sn = chordBeat[t];
				if (sn < 35 || sn > 81) {
					console.log("wrong midi drum n: " + sn);
					sn = 42;
				}

				var sample = toolbox.addSampleToSong(me.predefinedDrums[sn], me.parsedSong);
				sample.volume = 1.0;
				sample.isDrum = true;
				sample.midi = sn;
				toolbox.setBeatPointToRiff(i, sample.id, riff);
			}
		}
		toolbox.adjustArrayOfArray(riff.beat, meter);

		var rr = this.findOrAddRiffToSong(riff, riffSize);
		toolbox.addRiffIdToPosition(rr.id, songPosition);
	};
	this.parseSlotTunes = function (nn, riffSize, meter, songPosition) {
		//console.log("parseSlotTunes " + nn);
		for (var i = 0; i < riffSize; i++) {
			var chord = me.songTuneSteps[i + nn]; //* riffSize];
			if (!chord) {
				chord = [];
				me.songTuneSteps[i + nn] = chord;
			}
			for (var t = 0; t < chord.length; t++) {
				var sn = chord[t].instrument;
				if (sn < 0 || sn > 127) {
					console.log("unknown instrument: " + sn);
					sn = 0;
				}
				var sample = toolbox.addSampleToSong(me.predefinedInstruments[sn], me.parsedSong);
				sample.isDrum = false;
				sample.midi = sn;
			}
		}
		for (var i = 0; i < me.parsedSong.samples.length; i++) {
			var songSample = me.parsedSong.samples[i];
			//console.log("--songSample "+songSample.path)

			var songRiffTune = new SongRiffTune();
			toolbox.adjustArrayOfArray(songRiffTune.steps, meter);
			songRiffTune.sampleId = songSample.id;
			var found = false;
			for (var k = 0; k < riffSize; k++) {
				var chord = me.songTuneSteps[k + nn]; // * riffSize];
				//console.log("----check instrument " + songSample.path);
				for (var t = 0; t < chord.length; t++) {
					var midiNote = chord[t];

					//var n = "instrument" + midiNote.instrument;
					var sn = midiNote.instrument;
					if (sn < 0 || sn > 127) {
						sn = 0;
					}
					var samplePath = me.predefinedInstruments[sn];
					//console.log("------"+n);
					if (samplePath == songSample.path) {
						//console.log(midiNote);
						//console.log("------"+n+" equals "+songSample.path);
						toolbox.setTunePointToTune(k, midiNote.pitch, midiNote.length, midiNote.glissando, songRiffTune);
						// = function(step, pitch, length, shift, tune) {
						//console.log(songRiffTune);
						found = true;
					}
				}
			}

			if (found) {
				var songRiff = new SongRiff();
				toolbox.addTuneToRiff(songRiffTune, songRiff);
				//console.log("----found for "+toolbox.findSampleById(songRiffTune.sampleId, me.parsedSong).path);
				//console.log(songRiffTune);
				//}
				//if (!me.isRiffEmpty(songRiff)) {//instrument16
				//console.log(songRiff, riffSize);
				var rr = this.findOrAddRiffToSong(songRiff, riffSize);
				//var xx = nn % 4;
				//var yy = Math.floor(nn / 4);
				toolbox.addRiffIdToPosition(rr.id, songPosition);
				//console.log("----add riff for sample "+toolbox.findSampleById(songRiffTune.sampleId, me.parsedSong).path);
				//console.log(songRiff);
			} else {
				//console.log("----empty for sample "+toolbox.findSampleById(songRiffTune.sampleId, me.parsedSong).path);
			}

		}
	};
	this.isRiffEmpty = function (songRiff) {
		for (var i = 0; i < songRiff.beat.length; i++) {
			var chord = songRiff.beat[i];
			if (chord.length > 0) {
				return false;
			}
		}
		for (var i = 0; i < songRiff.tunes.length; i++) {
			var songRiffTune = songRiff.tunes[i];
			for (var k = 0; k < songRiffTune.steps.length; k++) {
				var chord = songRiffTune.steps[i];
				if (chord.length > 0) {
					return false;
				}
			}
		}
		return true;
	};
	this.findOrAddRiffToSong = function (riff, riffSize) {
		toolbox.adjustArrayOfArray(riff.beat, riffSize - 1);
		for (var i = 0; i < me.parsedSong.riffs.length; i++) {
			//console.log(riff, me.parsedSong.riffs[i], riffSize);
			if (this.isRiffEquals(riff, me.parsedSong.riffs[i], riffSize)) {
				return me.parsedSong.riffs[i];
			}
		}
		toolbox.addRiffToSong(riff, me.parsedSong);
		return riff;
	};
	this.isRiffEquals = function (r1, r2, meter) {
		var e12 = this.biRiffEquals(r1, r2, meter);
		var e21 = this.biRiffEquals(r2, r1, meter);
		var e = e12 && e21;
		//if(e){
		//console.log("isRiffEquals "+r1.id +" and "+r2.id);
		//}
		return e;
		//return this.biRiffEquals(r1, r2) && this.biRiffEquals(r2, r1);
	};
	this.biRiffEquals = function (r1, r2, meter) {
		if (!me.isRiffBeatPartEquals(r1, r2)) {
			return false;
		}
		if (!me.isRiffTunePartEquals(r1, r2, meter)) {
			return false;
		}
		return true;
	};
	this.isRiffBeatPartEquals = function (r1, r2) {
		if (r1.beat.length != r2.beat.length)
			return false;
		for (var i = 0; i < r1.beat.length; i++) {
			var beatChord1 = r1.beat[i];
			var beatChord2 = r2.beat[i];
			for (var t = 0; t < beatChord1.length; t++) {
				var found = false;
				for (var k = 0; k < beatChord2.length; k++) {
					if (beatChord2[k].sampleId == beatChord1[t].sampleId) {
						found = true;
						break;
					}
				}
				if (!found) {
					return false;
				}
			}
		}
		return true;
	};
	this.isRiffTunePartEquals = function (r1, r2, meter) {
		for (var i = 0; i < r1.tunes.length; i++) {
			var songRiffTune = r1.tunes[i];
			if (!me.isTuneExistsInTunes(songRiffTune, r2.tunes, meter)) {
				return false;
			}
		}
		//console.log("isRiffTunePartEquals "+r1.id +" == "+r2.id);
		return true;
	};
	this.isTuneExistsInTunes = function (t, tunes, meter) {
		for (var i = 0; i < tunes.length; i++) {
			var songRiffTune = tunes[i];
			if (me.isTunesEquals(t, songRiffTune, meter)) {
				return true;
			}
		}
		return false;
	};
	this.isTunesEquals = function (songRiffTune1, songRiffTune2, meter) {

		if (songRiffTune1.sampleId != songRiffTune1.sampleId) {
			return false;
		}
		toolbox.adjustArrayOfArray(songRiffTune1.steps, meter - 1);
		toolbox.adjustArrayOfArray(songRiffTune2.steps, meter - 1);
		for (var i = 0; i < meter; i++) {
			var chord1 = songRiffTune1.steps[i];
			var chord2 = songRiffTune2.steps[i];
			//console.log(chord1);
			//console.log(chord2);
			for (var s1 = 0; s1 < chord1.length; s1++) {
				var songRiffTunePoint1 = chord1[s1];
				var found = false;
				for (var s2 = 0; s2 < chord2.length; s2++) {
					var songRiffTunePoint2 = chord2[s2];
					if (songRiffTunePoint1.pitch == songRiffTunePoint2.pitch
						 && songRiffTunePoint1.length == songRiffTunePoint2.length
						 && songRiffTunePoint1.shift == songRiffTunePoint2.shift //
					) {
						found = true;
						break;
					}
				}
				if (!found) {
					return false;
				}
			}
		}
		return true;
	};

	this.dumpBeatRiffs = function () {
		//console.log(me.beatRiffs);
		for (var i = 0; i < me.beatRiffs.length; i++) {
			var beat = me.beatRiffs[i];
			//console.log(beat);
			var s = "" + i + " - ";
			for (var b = 0; b < beat.length; b++) {
				var chordBeat = beat[b];
				s = s + " " + b + ": ";
				for (var d = 0; d < chordBeat.length; d++) {
					s = s + "[" + chordBeat[d] + "]";
				}

			}
			console.log(s);
		}
	};
	this.dumpSong = function () {
		//console.log(me.songBeatSteps);
		//console.log(me.songTuneSteps);
		me.sureTuneStep(me.maxLastStep);
		me.sureBeatStep(me.maxLastStep);
		for (var i = 0; i < 99; i++) {
			//for (var i = 0; i < me.maxLastStep; i++) {
			var chordBeat = me.songBeatSteps[i];
			var chordTune = me.songTuneSteps[i];
			var s = "" + i + ": ";
			for (var d = 0; d < chordBeat.length; d++) {
				s = s + "[" + chordBeat[d] + "]";
			}
			s = s + ": ";
			for (var t = 0; t < chordTune.length; t++) {
				s = s + "(p" + chordTune[t].pitch + ",s" + chordTune[t].instrument + ",d" + chordTune[t].length + ",g" + chordTune[t].glissando + ")";
			}
			console.log(s);
			//if(i>256)break;
		}
	};
	this.parseTrack = function () {
		/*
		 * console.log(String.fromCharCode(me.readNextByte()));
		 * console.log(String.fromCharCode(me.readNextByte()));
		 * console.log(String.fromCharCode(me.readNextByte()));
		 * console.log(String.fromCharCode(me.readNextByte()));
		 */
		// console.log(me.readString(4));
		var id = me.readString(4); // new String(data, counter, 4);
		// counter = counter + 4;
		var len = me.read4BigEndian();
		var mem = me.counter;
		console.log("parseTrack: id: " + id + ", len: " + len );
		if (id == "MTrk") {
			var stop = me.counter + len - 4;
			var baseDelta = 0;
			me.lastStep = 0;
			eventCount = 0;
			while (me.counter < stop && me.lastStep < me.limitImport) {
				baseDelta = me.readNextEvent(baseDelta);
			}
			if (me.maxLastStep < me.lastStep) {
				me.maxLastStep = me.lastStep;
			}
			if (me.maxLastStep > me.limitImport) {
				me.maxLastStep = me.limitImport;
			}
		} else {
			console.log("skip---------------------------------------");
		}
		me.counter = mem + len;

	};
	this.findProgram = function (channel, step) {
		for (var i = 0; i < me.programValues.length; i++) {
			var pChannel = me.programChannels[i];
			var pStep = me.programSteps[i];
			if (pChannel == channel && pStep <= step) {
				var pValue = me.programValues[i];
				return pValue;
			}
		}
		// console.log("no findProgram: channel " + channel + ", step " + step);
		return -1;
	};

	this.readNextEvent = function (deltatime) {
		eventCount++;
		var cudelta = me.readTimeDelta();
		var delta = deltatime + cudelta;
		me.lastStep = Math.round(delta / (me.ticksPerQuarter / 4.0));
		var status = me.readNextByte();
		//if(eventCount<eventCountStop)console.log("status: 0x" + status.toString(16)+",delta "+delta+", floor " +me.lastStep+" / "+(delta / (me.ticksPerQuarter / 4.0)));
		var n2 = 0;
		var n3 = 0;
		var len = 0;
		var prg = 0;
		var startCounter = 0;
		if (status == 0xff) { // Reset
			var kind = me.readNextByte();
			len = me.readNextByte();
			startCounter = me.counter;
			var tt = "?";
			var port = -1;
			switch (kind) {
			case 0x01:
				tt = me.readString(len);
				break;
			case 0x02:
				tt = me.readString(len);
				break;
			case 0x03:
				tt = me.readString(len);
				//console.log("status == 0xff: 0x" + kind.toString(16) + ": " + tt);
				break;
			case 0x04:
				tt = me.readString(len);
				break;
			case 0x05:
				tt = me.readString(len);
				break;
			case 0x06:
				tt = me.readString(len);
				break;
			case 0x07:
				tt = me.readString(len);
				break;
			case 0x08:
				tt = me.readString(len);
				break;
			case 0x09:
				tt = me.readString(len);
				break;
			case 0x20:
				tt = me.readString(len);
				break;
			case 0x21:
				port = me.readNextByte();
				break;
			case 0x2f:
				tt = me.readString(len);
				break;
			case 0x51:
				tt = me.readString(len);
				break;
			case 0x54:
				tt = me.readString(len);
				break;
			case 0x58:
				tt = me.readString(len);
				break;
			case 0x59:
				tt = me.readString(len);
				break;
			case 0x7f:
				tt = me.readString(len);
				break;
			default:
				//
				break;
			}
			//console.log("status == 0xff: 0x" + kind.toString(16) + ": " + tt+port);
			// counter = startCounter + len;
		} else {
			if (status == 0xf0) { // System exclusive (sysex) message
				len = me.readNextByte();
				startCounter = me.counter;
				me.counter = startCounter + len;
			} else {
				var ch = 0;
				if (status >= 0xb0 && status <= 0xbf) { // Controller
					ch = status & 0x0f;
					n2 = me.readNextByte();
					n3 = me.readNextByte();
					// System.out.println("\tcontrol x" +
					// Integer.toHexString(n2) + "/x" + Integer.toHexString(n3)
					// + " for channel " + ch);
				} else {
					if (status >= 0xc0 && status <= 0xcf) { // Program change
						n2 = me.readNextByte();
						ch = status & 0x0f;
						if (eventCount < eventCountStop)
							//console.log("program " + n2 + " for channel " + ch + ", delta " + delta);
							// programValues.addElement(new Integer(n2));
							// programDelta.addElement(new Integer(delta));
							// programChannels.addElement(new Integer(ch));
							me.programValues[me.programValues.length] = n2;
						me.programSteps[me.programSteps.length] = me.lastStep;
						me.programChannels[me.programChannels.length] = ch;
					} else {
						if (status >= 0x90 && status <= 0x9f) { // Note on
							me.currentEventChannel = status & 0x0f;
							n2 = me.readNextByte();
							n3 = me.readNextByte();
							// System.out.println("\tnoteOn, n2: " + n2 + ", n3:
							// " + n3);
							if (me.currentEventChannel == 9) {
								//me.setBeat(me.lastStep, n2);
								if (n2 < 35 || n2 > 81) {
									console.log("raw setBeat: wrong midi drum n: " + n2);
								} else {
									//if(n2==75){
									//console.log("raw setBeat: wrong parser hook last drum n: " + n2+"/"+me.lastStep);
									//}else{
									//console.log("raw setBeat: "+me.lastStep+", n2: " + n2);
									me.setBeat(me.lastStep, n2);
									//}
								}
							} else {
								prg = me.findProgram(me.currentEventChannel, me.lastStep);
								if (n3 == 0) { //volume 0
									// System.out.println("\t\t=noteOff");
									//console.log("stopNote channel: "+me.currentEventChannel+", pitch: "+ n2+", stopDelta: "+ delta+", gliss: "+ -Math.floor(me.currentBend[me.currentEventChannel] * 1.01));
									me.stopNote(me.currentEventChannel, n2, me.lastStep, -Math.floor(me.currentBend[me.currentEventChannel] * 1.01));
								} else {
									/*if (n3 < 70) {
									prg = prg + 128;
									}*/
									me.startTune(me.currentEventChannel, me.lastStep, n2, prg);
									//console.log("note start: channel: "+me.currentEventChannel+", pitch: "+ n2+", stopDelta: "+ delta);
									//me.notePitches[me.notePitches.length] = n2;
									//me.noteChannels[me.noteChannels.length] = me.currentEventChannel;
									//me.noteSteps[me.noteSteps.length] = me.lastStep;
								}
							}
						} else {
							if (status >= 0x80 && status <= 0x8f) { // Note off
								ch = status & 0x0f;
								n2 = me.readNextByte();
								n3 = me.readNextByte();
								// System.out.println("\tnoteOff, n2: " + n2 +
								// ", n3: " + n3);
								if (ch != 9) {
									me.stopNote(ch, n2, me.lastStep, -Math.floor(me.currentBend[ch] * 1.01));
								}
							} else {
								if (status >= 0xe0 && status <= 0xef) { // Pitch
									// /
									// modulation
									// wheel
									ch = status & 0x0f;
									n2 = me.readNextByte();
									n3 = me.readNextByte();
									var bendCount = me.bendSizeA[ch] - 1;
									if (bendCount < 1) {
										bendCount = 36;
									}
									var bendStep = 0x1fff / bendCount;
									var bnd = (me.from14(n2, n3) - 0x2000) / bendStep;
									me.currentBend[ch] = bnd;
									// System.out.println("\tbend: " + bnd);
								} else {
									if (status >= 0xa0 && status <= 0xaf) { // Aftertouch
										// /
										// key
										// pressure
										n2 = me.readNextByte();
										n3 = me.readNextByte();
									} else {
										if (status >= 0xd0 && status <= 0xdf) { // Channel
											// pressure
											n2 = me.readNextByte();
										} else {
											if (status >= 0xf1) { // MIDI time
												// code
												// quarter
												// frame
												//
											} else {
												if (status >= 0xf2) { // Song
													// position
													// pointer
													n2 = me.readNextByte();
													n3 = me.readNextByte();
												} else {
													if (status >= 0xf3) { // Song select
														n2 = me.readNextByte();
													} else {
														if (status >= 0xf6) { // Tune request
															//
														} else {
															if (status >= 0xf8) { // MIDI clock
																//
															} else {
																if (status >= 0xfa) { // MIDI start
																	//
																} else {
																	if (status >= 0xfb) { // MIDI continue
																		//
																	} else {
																		if (status >= 0xfc) { // MIDI stop
																			//
																		} else {
																			if (status >= 0xfe) { // Active sense
																				//
																			} else {
																				if (status < 0x80) { //proceed squized command
																					n2 = status;
																					n3 = me.readNextByte();
																					// System.out.println("\t\tcontinue
																					// noteOn,
																					// n2:
																					// " +
																					// n2 +
																					// ",
																					// n3:
																					// " +
																					// n3);
																					if (me.currentEventChannel == 9) {
																						if (n2 < 35 || n2 > 81) {
																							console.log("squized setBeat: wrong midi drum n: " + n2);
																						} else {
																							me.setBeat(me.lastStep, n2);
																						}
																					} else {
																						prg = me.findProgram(me.currentEventChannel, me.lastStep); //+ 1;
																						if (n3 == 0) {
																							// System.out.println("\t\t=noteOff");
																							//if(eventCount<eventCountStop)console.log("stopNote due n3=0");
																							me.stopNote(me.currentEventChannel, n2, me.lastStep, -Math.floor(me.currentBend[me.currentEventChannel] * 1.01));
																						} else {
																							/*if (n3 < 70) {
																							prg = prg + 128;
																							}*/
																							//if(eventCount<eventCountStop)console.log(me.currentEventChannel);
																							me.startTune(me.currentEventChannel, me.lastStep, n2, prg);
																							//console.log("sq note start: channel: "+me.currentEventChannel+", pitch: "+ n2+", stopDelta: "+ delta);
																							//me.notePitches[me.notePitches.length] = n2;
																							//me.noteChannels[me.noteChannels.length] = me.currentEventChannel;
																							//me.noteSteps[me.noteSteps.length] = me.lastStep;
																						}
																					}

																				} else {
																					n2 = me.readNextByte();
																					n3 = me.readNextByte();
																					console.log("\tunknown " + Integer.toHexString(status) + ": " + Integer.toHexString(n2) + "/" + Integer.toHexString(n3));
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return delta;
	};
	this.sureBeatStep = function (n) {
		for (var i = me.songBeatSteps.length; i <= n; i++) {
			me.songBeatSteps[i] = [];
		}
	}
	this.setBeat = function (step, drum) {

		// console.log("setBeat "+step+": "+drum);
		me.sureBeatStep(step);
		var chord = me.songBeatSteps[step];
		for (var i = 0; i < chord.length; i++) {
			if (chord[i] == drum) {
				return;
			}
		}
		chord[chord.length] = drum;
	};
	this.sureTuneStep = function (n) {
		for (var i = me.songTuneSteps.length; i <= n; i++) {
			me.songTuneSteps[i] = [];
		}
	}
	/*
	this.setTune = function(channel,step, pitch, instrument, length, glissando) {
	if(eventCount<eventCountStop)console.log("setTune channel: "+channel+", step: "+step+", pitch: "+pitch+", instr: "+instrument+", len: "+length+", gliss: "+glissando);
	me.notePitches[me.notePitches.length] = pitch;
	me.noteChannels[me.noteChannels.length] = channel;
	me.noteSteps[me.noteSteps.length] = step;
	if (!me.findTune(step, pitch, instrument)) {
	// me.sureTuneStep(step);
	var chord = me.songTuneSteps[step];
	/
	 * for ( var i = 0; i < chord.length; i++) { if (chord[i].instrument ==
	 * instrument && chord[i].pitch == pitch) { return; } }
	/
	var point = new MIDINote();
	point.pitch = pitch;
	point.instrument = instrument;
	point.length = length;
	point.glissando = glissando;
	chord[chord.length] = point;
	//console.log(point);
	}
	};
	 */
	this.startTune = function (channel, step, pitch, instrument) {
		//if(eventCount<eventCountStop)console.log("startTune channel: "+channel+", step: "+step+", pitch: "+pitch+", instr: "+instrument+", cache "+me.notePitches.length);

		if (!me.findTune(step, pitch, instrument)) {
			var chord = me.songTuneSteps[step];
			var point = new MIDINote();
			point.pitch = pitch;
			point.instrument = instrument;
			point.length = 1;
			point.glissando = 0;
			chord[chord.length] = point;
			me.notePitches[me.notePitches.length] = pitch;
			me.noteChannels[me.noteChannels.length] = channel;
			me.noteSteps[me.noteSteps.length] = step;
		}
	};
	this.stopTune = function (channel, step, pitch, instrument, length, glissando) {
		//if(eventCount<eventCountStop)console.log("     stopTune channel: "+channel+", step: "+step+", pitch: "+pitch+", instr: "+instrument+", len: "+length+", gliss: "+glissando+", cache "+me.notePitches.length);
		//me.notePitches[me.notePitches.length] = pitch;
		//me.noteChannels[me.noteChannels.length] = channel;
		//me.noteSteps[me.noteSteps.length] = step;
		if (length > 64) {
			length = 64;
		}
		if (me.findTune(step, pitch, instrument)) {
			var chord = me.songTuneSteps[step];
			for (var i = 0; i < chord.length; i++) {
				if (chord[i].instrument == instrument && chord[i].pitch == pitch) {
					//chord[i].pitch = pitch;
					//chord[i].instrument = instrument;
					chord[i].length = length;
					if (chord[i].length == 0) {
						chord[i].length = 1;
					}
					chord[i].glissando = glissando;
					break;
				}
			}
		} else {
			/*
			var chord = me.songTuneSteps[step];
			var point = new MIDINote();
			point.pitch = pitch;
			point.instrument = instrument;
			point.length = length;
			point.glissando = glissando;
			chord[chord.length] = point;
			 */
		}
	};
	this.findTune = function (step, pitch, instrument) {
		//console.log("findTune "+step+": "+pitch+": "+instrument);
		me.sureTuneStep(step);
		var chord = me.songTuneSteps[step];
		//console.log(step+": "+chord);
		for (var i = 0; i < chord.length; i++) {
			if (chord[i].instrument == instrument && chord[i].pitch == pitch) {
				return true;
			}
		}
		return false;
	};

	this.stopNote = function (channel, pitch, stopStep, glissando) {
		//if(eventCount<eventCountStop)console.log("       stopNote channel: "+channel+", step: "+stopStep+", pitch: "+ pitch+", instr: ?, len: ?, gliss: "+ glissando+" ("+me.notePitches.length+")");

		//if(glissando!=0)console.log(glissando);
		var notFound = true;
		for (var i = 0; i < me.notePitches.length; i++) {
			var notePitch = me.notePitches[i];
			var noteChannel = me.noteChannels[i];
			var noteStep = me.noteSteps[i];

			if (notePitch == pitch && noteChannel == channel && noteStep <= stopStep) {

				var instrument = me.findProgram(channel, stopStep);
				//console.log(stopDelta);
				var len = (stopStep - noteStep); // / (me.ticksPerQuarter / 4.0) - 1;

				if (len >= 0) {
					//var step = Math.floor(noteDelta / (me.ticksPerQuarter / 4));
					if (me.findTune(noteStep, pitch, instrument)) {
						me.stopTune(channel, noteStep, pitch, instrument, len, glissando);
						me.notePitches.splice(i, 1);
						me.noteChannels.splice(i, 1);
						me.noteSteps.splice(i, 1);
						notFound = false;
						//if(eventCount<eventCountStop)console.log("         now cache "+me.notePitches.length);
						/*} else {
						if (me.findTune(step, pitch , instrument + 1 + 128)) {
						me.setTune(step, pitch , instrument + 1 + 128,
						len, glissando);*/
						break;
					}
					/*else {
					console.log("no tune for " + instrument);
					}*/
					//}
				}
				break;
			}
		}
		if (notFound) {
			if (eventCount < eventCountStop)
				console.log("              stopNote! no tune channel: " + channel + ", step: " + stopStep + ", pitch: " + pitch + ", instr: ?, len: ?, gliss: " + glissando + " (" + me.notePitches.length + ")");
		}
	};
	this.readTimeDelta = function () {
		var timeDelta = 0;
		var b = 0;
		do {
			b = me.readNextByte();
			timeDelta = (timeDelta << 7) + (b & 0x7f);
		} while ((b & 0x80) != 0);
		return timeDelta;
	};
	this.from14 = function (lsb, msb) {
		var r = msb << 7;
		r = r + lsb;
		return r;
	};
	this.readString = function (len) {
		var r = "";
		for (var i = 0; i < len; i++) {
			r = r + String.fromCharCode(me.readNextByte());
		}
		return r;
	};
	this.read4BigEndian = function () {
		var byte0 = me.unsignedByte(me.dataView.getUint8(me.counter + 0));
		var byte1 = me.unsignedByte(me.dataView.getUint8(me.counter + 1));
		var byte2 = me.unsignedByte(me.dataView.getUint8(me.counter + 2));
		var byte3 = me.unsignedByte(me.dataView.getUint8(me.counter + 3));
		var r = byte0 * 256 * 256 * 256 + byte1 * 256 * 256 + byte2 * 256 + byte3;
		me.counter = me.counter + 4;
		return r;
	};
	this.read2BigEndian = function () {
		var byte0 = me.unsignedByte(me.dataView.getUint8(me.counter + 0));
		var byte1 = me.unsignedByte(me.dataView.getUint8(me.counter + 1));
		var r = byte0 * 256 + byte1;
		me.counter = me.counter + 2;
		return r;
	};
	this.readNextByte = function () {
		if (me.counter >= me.dataView.byteLength) {
			// System.out.println("ops " + counter + "/" + data.length);
			console.log("MidiParser.readNextByte: " + me.counter + " >= " + me.dataView.byteLength);
		}
		var r = me.unsignedByte(me.dataView.getUint8(me.counter + 0));
		// System.out.println(counter + ": " + r + " = x" +
		// Integer.toHexString(r));
		me.counter++;
		return r;
	};
	this.unsignedByte = function (b) {
		return b & 0xFF;
	};
	return this;
}

function PatternArray(s) {
	this.positions = [];
	this.patterns = [];
	this.from = [];
	this.meterRatio = 8;
	this.firstCommon = function (arr1, arr2, limit) {
		var r = [];
		var to = arr1.length;
		if (arr2.length < to) {
			to = arr2.length;
		}
		if (limit < to) {
			to = limit;
		}
		var f = 0;
		for (var i = 0; i < to; i++) {
			if (arr1[i] != arr2[i]) {
				break;
			}
			f = i + 1;
		}
		for (var i = 0; i < f; i++) {
			r.push(arr1[i]);
		}

		return r;
	};
	this.bsort = function (a, key) {
		var len = a.length;
		var buckets = [];
		var i = len;
		var j = -1;
		var b;
		var d = 0;
		var keys = 0;
		var bits;
		var key = key || identity;
		while (i--) {
			j = Math.max(key(a[i]), j);
		}
		bits = j >> 24 && 32 || j >> 16 && 24 || j >> 8 && 16 || 8;
		for (; d < bits; d += 4) {
			for (i = 16; i--; ) {
				buckets[i] = [];
			}
			for (i = len; i--; ) {
				buckets[(key(a[i]) >> d) & 15].push(a[i]);
			}
			for (b = 0; b < 16; b++) {
				for (j = buckets[b].length; j--; ) {
					a[++i] = buckets[b][j];
				}
			}
		}
		return a;
	};
	this.fill = function (s) {
		this.from = s;
		var len = s.length;
		var array = [];
		var swap = [];
		var order = [];
		var span;
		var sym;
		var i = len;
		while (i--) {
			array[i] = s[i];
			order[i] = i;
		}
		for (span = 1; sym != len && span < len; span *= 2) {
			this.bsort(order, function (i) {
				return array[(i + span) % len]
			});
			this.bsort(order, function (i) {
				return array[i]
			});
			sym = swap[order[0]] = 1;
			for (i = 1; i < len; i++) {
				if (array[order[i]] != array[order[i - 1]] || array[(order[i] + span) % len] != array[(order[i - 1] + span) % len]) {
					sym++;
				}
				swap[order[i]] = sym;
			}
			tmp = array;
			array = swap;
			swap = tmp;
		};
		this.positions = order;
		for (var i = 1; i < this.positions.length; i++) {
			var a = this.firstCommon(this.from.slice(this.positions[i]) //
				, this.from.slice(this.positions[i - 1]) //
				, Math.abs(this.positions[i] - this.positions[i - 1]) //
				);
			if (a.length > 2) { // && a.length<this.meterRatio+1){
				if (!this.existsPattern(a)) {
					var pos = this.findAll(a);
					if (pos.length > 1) {
						var o = {
							pattern : a,
							positions : pos
						};
						this.patterns.push(o);
					}
				}
			}
		}
		/*this.patterns.sort(function (o1, o2) {
		return o2.pattern.length - o1.pattern.length
		});
		this.longest = this.patterns[0];*/
	};
	this.existsPattern = function (pattern) {
		for (var i = 0; i < this.patterns.length; i++) {
			var cu = this.patterns[i];
			if (cu.length == pattern.length) {
				var equals = true;
				for (var k = 0; k < pattern.length; k++) {
					if (cu[k] != pattern[k]) {
						equals = false;
						break;
					}
				}
				if (equals) {
					return true;
				}
			}
		}
		return false;
	};
	this.findAll = function (pattern) {
		var f = [];
		for (var i = 0; i < this.from.length - pattern.length; i++) {
			var equals = true;
			for (var k = 0; k < pattern.length; k++) {
				if (this.from[i + k] != pattern[k]) {
					equals = false;
					break;
				}
			}
			if (equals) {
				f.push(i);
				i = i + pattern.length - 1;
			}
		}
		return f;
	};
	this.fill(s);
	return this;
}
/*
console.log("test start -------------------------");
function arrayEquals(a1, a2) {
if (a1.length == a2.length) {
return false;
}
for (var i = 0; i < a1.length; i++) {
if (a1[i] != a2[i]) {
return false;
}
}
return true;
};
function arraySingle(a1, n) {
if (a1.length != 1) {
return false;
}
if (a1[0] != n) {
return false;
}
return true;
};

ABranch = function () {
this.value = [];
this.leaves = [];
this.branches = [];
};

ABranch.prototype.checkBranches = function (arr) {
var node;
for (var i = 0; i < this.branches.length; i++) {
//node = this.branches[i];
node = this.branches[i];
//console.log(node.value);
if (arraySingle(node.value, arr[0])) {
//if (node.value == suf[0]) {
node.addSuffix(arr.slice(1));
return true;
}
}
return false;
};

ABranch.prototype.checkLeaves = function (arr) {
var node;
var leaf;
//console.log(arr);
for (var i = 0; i < this.leaves.length; i++) {

//leaf = this.leaves[i];
leaf = this.leaves.slice(i, i + 1);
//console.log(i,this.leaves[i],leaf , arr[0]);
if (leaf == arr[0]) {
node = new ABranch();
node.value = leaf.slice(0, 1);
node.addSuffix(arr.slice(1));
node.addSuffix(leaf.slice(1));
this.branches.push(node);
this.leaves.splice(i, 1);
return;
}
}
this.leaves.push(arr);
};

ABranch.prototype.addSuffix = function (arr) {
if (arr.length > 0) {
if (!this.checkBranches(arr)) {
this.checkLeaves(arr);
}
}
};

ABranch.prototype.getLongestRepeatedSubString = function () {
var str = [];
var temp = [];
for (var i = 0; i < this.branches.length; i++) {
temp = this.branches[i].getLongestRepeatedSubString();
if (temp.length > str.length) {
str = temp;
}
}
var r = this.value.slice();
r.push(str);
//return this.value + str;
return r;
};
ABranch.prototype.dump = function (tab) {
console.log(tab + this.value);
for (var i = 0; i < this.branches.length; i++) {
this.branches[i].dump(". " + tab);
}
};
SuffixTree = function (arr) {
this.tree = new ABranch();
for (var i = 0; i < arr.length; i++) {
this.tree.addSuffix(arr.slice(i));
}
}
//var s=new SuffixTree("missisippissi$");
var s = new SuffixTree([3, 3, 3, 2, 1, 1, 1, 4, -1]);
console.log(s);
//console.log(s.tree.dump());
s.tree.dump("");
console.log("test done --------------------------");
*/
