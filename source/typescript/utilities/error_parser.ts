
import {
    ParserFramework,
    KernelParserCore2,
    fillByteBufferWithUTF8FromString
} from "@candlelib/hydrocarbon";


const {
    token_production,
    init_table,
    KernelStateIterator,
    run,
    compare
} = KernelParserCore2;

const token_sequence_lookup = new Uint8Array([
    40, 41, 60, 97, 110, 111, 110, 121, 109, 111, 117, 115, 62, 58, 47, 47, 44, 36, 46, 95, 45, 97, 116
]);

const token_lookup = new Uint32Array([
    66220, 65710, 8201386, 65664, 65666, 65536, 66176, 8201384, 66688, 65538, 65672, 8347050,
    3627394, 6881448, 2687144, 4784296, 6357120, 8211882, 98464, 98432, 8200352, 4935850,
    7033002, 65696, 4259968, 589952, 1904040, 8203688, 8355242, 67712, 1903016, 217218, 68736,
    69760, 6889640, 2314370, 6889632, 8200360, 8346026, 82048, 65708, 128, 65668, 98440, 6881440,
    1900712, 327808, 1114240, 2162816, 8347048, 200832
]);

const states_buffer = new Uint32Array([
    0, 4026531840, 2164260864, 4026531841, 2852126728, 0, 131078, 2147491856, 2164269061,
    2147491842, 2151686147, 2147483655, 2147483657, 2147483648, 603979840, 603979854, 0,
    2147483648, 603979840, 603980870, 0, 4026531840, 2852126727, 65536, 131077, 2147489808,
    2147489797, 2147489794, 2151684099, 2147483655, 268435456, 603979816, 0, 268435456,
    1073745168, 805306381, 0, 805306369, 0, 0, 2852126723, 131075, 196617, 2181038093, 2147483666,
    2143289354, 2164260867, 2147483668, 2126512133, 2147483670, 2147483667, 2147483669,
    603979834, 603979920, 0, 1073741840, 805306369, 0, 1073741848, 805306369, 0, 1073741840,
    805306369, 0, 2768240647, 0, 65539, 2147495936, 2151684097, 2147483661, 603979840, 603979798,
    0, 805306368, 3221225483, 0, 0, 4026531840, 2852126732, 0, 131078, 2147500048, 2164277253,
    2147500034, 2151694339, 2147483655, 2147491849, 2147483649, 603979910, 603979876, 0,
    2147483649, 603979910, 603979902, 0, 2147483649, 603979910, 603980870, 0, 4026531840,
    2852192259, 196613, 1, 2147483655, 268435456, 603979884, 0, 4026531840, 2852126723, 131075,
    196617, 2181038093, 2147483666, 2143289354, 2164260867, 2147483668, 2126512133, 2147483670,
    2147483667, 2147483669, 603979837, 603979920, 0, 805306369, 0, 0, 2852192259, 393219,
    1, 2147483657, 268435456, 805306369, 0, 4026531840, 2768240644, 0, 65538, 2147483661,
    2143295489, 603979910, 603979798, 0, 0, 4026531840, 2852126735, 458755, 196617, 2181060621,
    2147506194, 2143289354, 2164275203, 2147506196, 2126534661, 2147506198, 2147506195,
    2147506197, 2147483650, 1610612739, 67109036, 67109049, 67109104, 603980425, 0, 2147483650,
    603980425, 603980069, 0, 2147483650, 603980425, 603980097, 0, 4026531840, 2852192260,
    524291, 1, 2147483658, 268435456, 603979958, 603980726, 0, 4026531840, 0, 1073742864,
    805306371, 0, 2852192259, 655363, 1, 2147483651, 268435456, 603979969, 0, 4026531840,
    2852126729, 720901, 131077, 2147483667, 2147483653, 2155872266, 2134900739, 2147493910,
    1610612739, 67109077, 67109080, 67109083, 0, 1610612738, 67109080, 67109083, 0, 603979998,
    0, 0, 1073745416, 805306383, 0, 1073745416, 805306384, 0, 1073745416, 805306385, 0, 2852126726,
    786437, 131077, 2164260872, 2147489813, 2147483666, 2147483659, 2147483668, 1073745416,
    805306383, 0, 1073745416, 805306384, 0, 1073745416, 805306385, 0, 0, 2852192261, 655363,
    1, 2147483651, 2147483660, 268435456, 603980026, 603980852, 0, 4026531840, 2852126726,
    851971, 131077, 2147483667, 2160066565, 2147491862, 2134900739, 2147491861, 1610612738,
    67109130, 67109139, 0, 603980057, 0, 4026531840, 0, 603980045, 603980808, 0, 603980048,
    603980830, 0, 1073744920, 805306377, 0, 603980054, 603980830, 0, 1073745168, 805306377,
    0, 2583691285, 1048579, 131075, 4026531840, 0, 0, 603980045, 603980808, 0, 603980054, 603980830,
    0, 2583756803, 655363, 65538, 4026531840, 0, 603980077, 0, 0, 2516582414, 1114117, 65538,
    603979961, 0, 603980085, 0, 0, 2785017860, 1179651, 65538, 2147487759, 2143289349, 603979961,
    0, 603980095, 0, 4026531840, 603980962, 0, 2852126731, 1310723, 131079, 2147483668, 2160070661,
    2164260882, 2147487763, 2151696397, 2147493909, 2147498006, 603981056, 0, 268435456,
    603979969, 0, 603981238, 0, 603981394, 0, 603980577, 0, 4026531840, 2852126724, 1376261,
    131076, 2147483667, 2147483653, 2147483670, 2134900739, 268435456, 1073745168, 805306385,
    0, 805306379, 0, 0, 2852126728, 851971, 131077, 2147487763, 2160066565, 2147495958, 2134908931,
    2147495957, 603980151, 0, 603980183, 0, 603980213, 0, 603980243, 0, 4026531840, 0, 2785017862,
    1441797, 131077, 2147483667, 2160066565, 2147487766, 2134900739, 2147491861, 603980167,
    0, 603980179, 0, 603980169, 0, 603980181, 0, 603980169, 0, 2852192260, 1507331, 1, 2147483653,
    268435456, 1073745168, 805306384, 0, 4026531840, 0, 603980169, 0, 805306378, 0, 2785017862,
    1441797, 131077, 2147483667, 2160066565, 2147487766, 2134900739, 2147491861, 603980199,
    0, 603980211, 0, 603980201, 0, 603980181, 0, 603980201, 0, 2852192260, 1638403, 1, 2147483667,
    268435456, 1073745168, 805306384, 0, 4026531840, 0, 603980201, 0, 2785017862, 1441797,
    131077, 2147483667, 2160066565, 2147487766, 2134900739, 2147491861, 603980229, 0, 603980241,
    0, 603980231, 0, 603980181, 0, 603980231, 0, 2852192260, 655363, 1, 2147483651, 268435456,
    1073745168, 805306384, 0, 4026531840, 0, 603980231, 0, 2852126726, 1048579, 65538, 2147483670,
    2147487765, 805306378, 0, 268435456, 1073745168, 805306384, 0, 4026531840, 2852126724,
    1703939, 196616, 2147487752, 2172653579, 2164260874, 2139099139, 2147487764, 2147487749,
    2147487762, 2147487763, 603980271, 0, 603980358, 0, 4026531840, 2785017866, 1769475,
    196619, 2147495944, 2181050379, 2172653578, 2139099139, 2147483668, 2155880453, 2147500054,
    2160082957, 2147483666, 2147491859, 2147500053, 603980297, 0, 603980321, 0, 603980342,
    0, 603980311, 0, 603980339, 0, 4026531840, 0, 2785017858, 1703939, 196616, 2147483656,
    2172649483, 2164260874, 2139095043, 2147483668, 2147483653, 2147483666, 2147483667,
    603980311, 0, 4026531840, 2852192260, 655363, 1, 2147483651, 268435456, 1073745168, 805306383,
    0, 4026531840, 0, 2785017858, 1835013, 196619, 2147483656, 2181038091, 2172649482, 2139095043,
    2147483668, 2155872261, 2147483670, 2160066573, 2147483666, 2147483667, 2147483669,
    603980311, 0, 603980339, 0, 1073743368, 805306373, 0, 2785017858, 720901, 196616, 2147483656,
    2172649483, 2164260874, 2139095043, 2147483668, 2147483653, 2147483666, 2147483667,
    603980311, 0, 603980339, 0, 0, 2852126731, 1966083, 131079, 2172649480, 2147497989, 2147498002,
    2151692291, 2151686155, 2147498003, 2147498004, 268435456, 1073743376, 805306373, 0,
    1073743368, 805306373, 0, 268435456, 1073745168, 805306383, 0, 4026531840, 2852126725,
    2031621, 1, 2147483662, 2147483656, 268435456, 603980392, 603980703, 0, 1073743880, 805306374,
    0, 1073743632, 805306374, 0, 2852126728, 2097155, 65538, 2147491850, 2147483659, 268435456,
    603980409, 603981486, 0, 268435456, 603980419, 603980726, 0, 4026531840, 2852192260,
    2162691, 1, 2147483660, 268435456, 1073743136, 805306372, 0, 4026531840, 0, 1073742616,
    805306371, 0, 1073742360, 805306370, 0, 3087008451, 2768240682, 0, 196619, 2147489808,
    2185267209, 2172717058, 2172708867, 2147536900, 2147530757, 2147524614, 2147495951,
    2147510282, 2147502091, 2147483665, 603980425, 603980119, 0, 603980425, 603980133, 0,
    603980425, 603980255, 0, 1073743368, 805306377, 3221225499, 0, 603980425, 603980054,
    603980830, 0, 603980425, 603980380, 0, 805306372, 3221225509, 0, 603980425, 603980395,
    0, 805306371, 3221225515, 0, 1073742088, 805306370, 3221225519, 0, 2583691271, 262149,
    65537, 4026531840, 268435456, 603980425, 603980422, 603980489, 0, 4026531840, 2499805186,
    0, 65537, 4026531840, 0, 0, 2852126735, 458755, 196617, 2181060621, 2147506194, 2143289354,
    2164275203, 2147506196, 2126534661, 2147506198, 2147506195, 2147506197, 2147483651,
    1610612739, 67109036, 67109049, 67109104, 603980533, 0, 2147483651, 603980533, 603980517,
    0, 2147483651, 603980533, 603980097, 0, 4026531840, 2583756803, 655363, 65538, 4026531840,
    0, 603980525, 0, 0, 2516582414, 720901, 65538, 603979961, 0, 603980085, 0, 0, 2768240670,
    0, 196618, 2147489808, 2181072905, 2147510282, 2168514563, 2147536900, 2147530757, 2147524614,
    2147495951, 2147502091, 2147483665, 603980533, 603980119, 0, 603980533, 603980133, 0,
    603980533, 603980255, 0, 1073743368, 805306377, 3221225497, 0, 603980533, 603980054,
    603980830, 0, 603980533, 603980380, 0, 805306372, 3221225507, 0, 603980533, 603980395,
    0, 805306371, 3221225513, 0, 0, 4026531840, 2852126728, 2228227, 131078, 2168463373, 2143297541,
    2147491862, 2151677955, 2147491859, 2147491861, 2147483654, 603980675, 603980595, 0,
    2147483654, 603980675, 603980653, 0, 4026531840, 2583756803, 655363, 65538, 4026531840,
    0, 603980603, 0, 0, 2516582414, 1441797, 65538, 603980621, 0, 603980611, 0, 0, 2785017860,
    1179651, 65538, 2147487759, 2143289349, 603980621, 0, 603980095, 0, 4026531840, 2852192259,
    655363, 1, 2147483651, 268435456, 603980629, 0, 4026531840, 2852126724, 1441797, 131076,
    2147483667, 2147483653, 2147483670, 2134900739, 1610612738, 67109080, 67109083, 0, 603980643,
    0, 0, 2583691285, 2293765, 65539, 1073745416, 805306385, 0, 1073745416, 805306384, 0, 0,
    2852126733, 2359299, 131077, 2164275213, 2143293445, 2147493910, 2147487763, 2147483669,
    603981238, 0, 268435456, 603980629, 0, 603981394, 0, 2147483655, 268435456, 1073744136,
    805306375, 603980380, 0, 4026531840, 2768240658, 0, 131078, 2147489808, 2164289545, 2155907078,
    2147495947, 2147504138, 2147483665, 603980675, 603980119, 0, 603980675, 603980133, 0,
    1073743368, 805306377, 3221225490, 0, 603980675, 603980054, 603980830, 0, 603980675,
    603980380, 0, 0, 4026531840, 2852192259, 1507331, 1, 2147483653, 268435456, 603980711,
    0, 4026531840, 2852126725, 2031621, 1, 2147483662, 2147483656, 268435456, 603980723,
    603980703, 0, 1073744656, 805306376, 0, 1073744408, 805306376, 0, 2852126728, 2424835,
    196616, 2176851981, 2147491859, 2147491858, 2139095043, 2147491860, 2126520325, 2147491862,
    2147491861, 2147483652, 603980762, 603980746, 0, 2147483652, 603980762, 603980097, 0,
    4026531840, 2583756803, 655363, 65538, 4026531840, 0, 603980754, 0, 0, 2516582414, 2490373,
    65538, 603979961, 0, 603980085, 0, 0, 2768240673, 0, 196617, 2147489808, 2176878601, 2147510282,
    2147502091, 2147549188, 2147530757, 2147524614, 2147495951, 2147483665, 603980762,
    603980119, 0, 603980762, 603980133, 0, 603980762, 603980255, 0, 1073743368, 805306377,
    3221225496, 0, 603980762, 603980054, 603980830, 0, 603980762, 603980380, 0, 805306372,
    3221225506, 0, 2583691275, 1900547, 65537, 4026531840, 268435456, 603980762, 603980409,
    603981486, 0, 0, 4026531840, 2852126724, 917507, 131076, 2147483667, 2151677957, 2147483669,
    2134900739, 2147483658, 603980820, 603981238, 0, 4026531840, 2768240644, 0, 65538, 2151684106,
    2147483664, 603980820, 603980133, 0, 0, 4026531840, 2852126724, 983043, 131076, 2147483667,
    2147483653, 2147483670, 2134900739, 2147483659, 603980842, 603981394, 0, 4026531840,
    2768240644, 0, 65538, 2147483665, 2143295499, 603980842, 603980119, 0, 0, 4026531840,
    2852192259, 2555907, 1, 2147483662, 268435456, 603980860, 0, 4026531840, 2852192260,
    1245187, 1, 2147483663, 268435456, 1073744920, 805306380, 0, 4026531840, 0, 2852126736,
    2621481, 131076, 2147500048, 2147508229, 2147483650, 2147491843, 2147483661, 603980946,
    603980894, 0, 2147483661, 603980946, 603980904, 0, 2147483661, 603980946, 603980914,
    0, 2147483661, 603980946, 603980924, 0, 4026531840, 2852192260, 2752515, 1, 2147483650,
    268435456, 1073745416, 805306381, 0, 4026531840, 0, 2852192260, 655363, 1, 2147483651,
    268435456, 1073745416, 805306381, 0, 4026531840, 0, 2852192260, 196649, 1, 2147483664,
    268435456, 1073745416, 805306381, 0, 4026531840, 0, 2852192260, 1507331, 1, 2147483653,
    268435456, 1073745416, 805306381, 0, 4026531840, 0, 2852126724, 65536, 131076, 2147483664,
    2147483653, 2147483650, 2147483651, 268435456, 1073745168, 805306381, 0, 4026531840,
    3087008924, 2499805197, 0, 65539, 4026531840, 0, 0, 603980946, 603980934, 0, 2499805197,
    0, 65537, 4026531840, 0, 0, 2852126728, 851971, 131077, 2147491859, 2160074757, 2147491862,
    2134900739, 2147491861, 2147483657, 603981032, 603980980, 0, 2147483657, 603981032,
    603981016, 0, 4026531840, 0, 2583756803, 655363, 65538, 4026531840, 0, 603980988, 0, 0,
    2516582414, 1441797, 65538, 603980621, 0, 603980996, 0, 0, 2785017860, 1179651, 65538,
    2147487759, 2143289349, 603980621, 0, 603981006, 0, 4026531840, 2852192261, 2818051,
    1, 2147483651, 2147483660, 268435456, 603980026, 603980852, 0, 4026531840, 2852126727,
    2883587, 131076, 2147483669, 2143293445, 2147493910, 2147487763, 603981238, 0, 268435456,
    603980629, 0, 603981394, 0, 4026531840, 0, 2768240655, 0, 131077, 2147489808, 2160095241,
    2147504138, 2147495947, 2147483665, 603981032, 603980119, 0, 603981032, 603980133, 0,
    1073743368, 805306377, 3221225489, 0, 603981032, 603980054, 603980830, 0, 0, 4026531840,
    2852126740, 2949123, 131077, 2147516436, 2147500037, 2147483666, 2151686147, 2147508243,
    2147483663, 603981222, 603981086, 0, 2147483663, 603981222, 603981096, 0, 2147483663,
    603981222, 603981106, 0, 2147483663, 603981222, 603981116, 0, 2147483663, 603981222,
    603981126, 0, 4026531840, 0, 2852192260, 3014659, 1, 2147483666, 268435456, 1073745416,
    805306383, 0, 4026531840, 0, 2852192260, 655363, 1, 2147483651, 268435456, 1073745416,
    805306383, 0, 4026531840, 0, 2852192260, 1507331, 1, 2147483653, 268435456, 1073745416,
    805306383, 0, 4026531840, 0, 2852192260, 1638403, 1, 2147483667, 268435456, 1073745416,
    805306383, 0, 4026531840, 0, 2852192260, 3080195, 1, 2147483668, 268435456, 1073745416,
    805306383, 0, 4026531840, 0, 2852126724, 1703939, 196616, 2147487752, 2172653579, 2164260874,
    2139099139, 2147487764, 2147487749, 2147487762, 2147487763, 603981152, 0, 603981208,
    0, 4026531840, 2785017865, 1769475, 196619, 2147495944, 2181050379, 2172653578, 2139099139,
    2147483668, 2155880453, 2147500054, 2160082957, 2147483666, 2147491859, 2147500053,
    603980297, 0, 603981176, 0, 603981194, 0, 603980311, 0, 4026531840, 4026531840, 2785017858,
    1835013, 196619, 2147483656, 2181038091, 2172649482, 2139095043, 2147483668, 2155872261,
    2147483670, 2160066573, 2147483666, 2147483667, 2147483669, 603980311, 0, 4026531840,
    0, 2785017858, 720901, 196616, 2147483656, 2172649483, 2164260874, 2139095043, 2147483668,
    2147483653, 2147483666, 2147483667, 603980311, 0, 4026531840, 2852126724, 1966083, 131077,
    2147483668, 2147483653, 2147483666, 2151677955, 2147483667, 268435456, 1073745168,
    805306383, 0, 4026531840, 0, 3087009200, 2499805199, 0, 65539, 4026531840, 0, 0, 603981222,
    603981136, 0, 2499805199, 0, 65537, 4026531840, 0, 0, 2852126736, 917507, 131076, 2147500051,
    2151702533, 2147483669, 2134908931, 2147483664, 603981378, 603981262, 0, 2147483664,
    603981378, 603981272, 0, 2147483664, 603981378, 603981282, 0, 2147483664, 603981378,
    603981292, 0, 4026531840, 2852192260, 3145731, 1, 2147483669, 268435456, 1073745416,
    805306384, 0, 4026531840, 0, 2852192260, 655363, 1, 2147483651, 268435456, 1073745416,
    805306384, 0, 4026531840, 0, 2852192260, 1638403, 1, 2147483667, 268435456, 1073745416,
    805306384, 0, 4026531840, 0, 2852192260, 1507331, 1, 2147483653, 268435456, 1073745416,
    805306384, 0, 4026531840, 0, 2852126728, 851971, 131077, 2147487763, 2160074757, 2147495958,
    2134900739, 2147495957, 603981320, 0, 603981336, 0, 603981352, 0, 603981368, 0, 4026531840,
    0, 2785017862, 1441797, 131077, 2147483667, 2160066565, 2147487766, 2134900739, 2147491861,
    603980229, 0, 603980241, 0, 603980231, 0, 4026531840, 0, 2785017862, 1441797, 131077, 2147483667,
    2160066565, 2147487766, 2134900739, 2147491861, 603980199, 0, 603980211, 0, 603980201,
    0, 4026531840, 0, 2785017862, 1441797, 131077, 2147483667, 2160066565, 2147487766, 2134900739,
    2147491861, 603980167, 0, 603980179, 0, 603980169, 0, 4026531840, 0, 2852126724, 1048579,
    1, 2147483669, 268435456, 1073745168, 805306384, 0, 4026531840, 0, 3087009356, 2499805200,
    0, 65539, 4026531840, 0, 0, 603981378, 603981302, 0, 2499805200, 0, 65537, 4026531840, 0,
    0, 2852126736, 983043, 131076, 2147491859, 2147483653, 2147500054, 2134925315, 2147483665,
    603981470, 603981418, 0, 2147483665, 603981470, 603981428, 0, 2147483665, 603981470,
    603981438, 0, 2147483665, 603981470, 603981448, 0, 4026531840, 2852192260, 1507331, 1,
    2147483653, 268435456, 1073745416, 805306385, 0, 4026531840, 0, 2852192260, 1638403,
    1, 2147483667, 268435456, 1073745416, 805306385, 0, 4026531840, 0, 2852192260, 1572867,
    1, 2147483670, 268435456, 1073745416, 805306385, 0, 4026531840, 0, 2852192260, 655363,
    1, 2147483651, 268435456, 1073745416, 805306385, 0, 4026531840, 0, 2852126724, 1376261,
    131076, 2147483667, 2147483653, 2147483670, 2134900739, 268435456, 1073745168, 805306385,
    0, 4026531840, 3087009448, 2499805201, 0, 65539, 4026531840, 0, 0, 603981470, 603981458,
    0, 2499805201, 0, 65537, 4026531840, 0, 0, 2852126735, 458755, 196617, 2181060621, 2147506194,
    2143289354, 2164275203, 2147506196, 2126534661, 2147506198, 2147506195, 2147506197,
    2147483662, 1610612739, 67109036, 67109049, 67109104, 603981547, 0, 2147483662, 603981547,
    603981514, 0, 2147483662, 603981547, 603980097, 0, 4026531840, 2583756803, 655363, 65538,
    4026531840, 0, 603981522, 0, 0, 2785017860, 3211267, 196621, 2147487752, 2147487761, 2172653578,
    2164264963, 2172653580, 2172653573, 2172649486, 2155876363, 2147487762, 2147487763,
    2147487764, 2147487765, 2147487766, 603980085, 0, 603979961, 0, 4026531840, 0, 1073742360,
    805306382, 0, 3087009573, 2768240682, 0, 196619, 2147489808, 2185285641, 2147528714,
    2168532995, 2147555332, 2147549189, 2160125958, 2147495951, 2147520523, 2147502094,
    2147483665, 603981547, 603980119, 0, 603981547, 603980133, 0, 603981547, 603980255, 0,
    2583691281, 3276803, 65537, 4026531840, 268435456, 603981547, 603981544, 603980489,
    0, 1073743368, 805306377, 3221225508, 0, 603981547, 603980054, 603980830, 0, 603981547,
    603980380, 0, 805306372, 3221225518, 0, 603981547, 603980395, 0, 805306371, 3221225524,
    0, 1073742088, 805306382, 3221225528, 0, 4026531840, 2499805198, 0, 65537, 4026531840,
    0, 0
]);

function isTokenActive(token_id, row) { var index = (row) + (token_id >> 5);; var shift = 1 << (31 & (token_id));; return (token_lookup[index] & shift) != 0; }

function scan_core(l, tk_row) {
    switch ((l.get_byte_at(l.byte_offset) & 127)) {
        case 36:
            { if (l.get_byte_at(l.byte_offset) == 36) { if (isTokenActive(18, tk_row)) { l.setToken(18, 1, 1); } } } break; case 40:
            { if (l.get_byte_at(l.byte_offset) == 40) { if (isTokenActive(11, tk_row)) { l.setToken(11, 1, 1); } } } break; case 41:
            { if (l.get_byte_at(l.byte_offset) == 41) { if (isTokenActive(12, tk_row)) { l.setToken(12, 1, 1); } } } break; case 44:
            { if (l.get_byte_at(l.byte_offset) == 44) { if (isTokenActive(17, tk_row)) { l.setToken(17, 1, 1); } } } break; case 45:
            { if (l.get_byte_at(l.byte_offset) == 45) { if (isTokenActive(21, tk_row)) { l.setToken(21, 1, 1); } } } break; case 46:
            { if (l.get_byte_at(l.byte_offset) == 46) { if (isTokenActive(19, tk_row)) { l.setToken(19, 1, 1); } } } break; case 47:
            { if (l.get_byte_at(l.byte_offset) == 47) { if (isTokenActive(22, tk_row)) { l.setToken(22, 1, 1); }; if (l.get_byte_at(l.byte_offset + 1) == 47) { if (isTokenActive(15, tk_row)) { l.setToken(15, 2, 2); } } } } break; case 58:
            { if (l.get_byte_at(l.byte_offset) == 58) { if (isTokenActive(14, tk_row)) { l.setToken(14, 1, 1); } } } break; case 60:
            { if (l.get_byte_at(l.byte_offset) == 60) { if (isTokenActive(13, tk_row) && 10 == compare(l, l.byte_offset + 1, 3, 10, token_sequence_lookup)) { l.setToken(13, 11, 11); } } } break; case 95:
            { if (l.get_byte_at(l.byte_offset) == 95) { if (isTokenActive(20, tk_row)) { l.setToken(20, 1, 1); } } } break; case 97:
            { if (l.get_byte_at(l.byte_offset) == 97) { if (l.get_byte_at(l.byte_offset + 1) == 116) { if (isTokenActive(10, tk_row)) { l.setToken(10, 2, 2); }; if (isTokenActive(3, tk_row) && l.isUniID() && l.byte_length > 2) { l._type = 3; } } } } break; default:
            break;
    }; if (((l._type) > 0)) return;; if (isTokenActive(0, tk_row) && false) { l._type = 0; return; } else if (isTokenActive(8, tk_row) && l.isSP(true)) { l._type = 8; return; } else if (isTokenActive(3, tk_row) && l.isUniID()) { l._type = 3; return; } else if (isTokenActive(2, tk_row) && l.isSym(true)) { l._type = 2; return; } else if (isTokenActive(7, tk_row) && l.isNL()) { l._type = 7; return; } else if (isTokenActive(5, tk_row) && l.isNum()) { l._type = 5; return; } else if (isTokenActive(16, tk_row) && false) { l._type = 16; return; }
}

function scan(l, token, skip) { if (((l._type) <= 0)) scan_core(l, token);; if ((skip > 0 && isTokenActive(l._type, skip))) { while ((isTokenActive(l._type, skip))) { l.next(); scan_core(l, token); } } }

const js_parser_pack = {

    init_table: () => {
        const table = new Uint8Array(382976);
        init_table(table);
        return table;
    },

    create_iterator: (data) => {
        return new KernelStateIterator(data);
    },

    recognize: (string, entry_index) => {

        const temp_buffer = new Uint8Array((string.length + 1) * 4);

        const actual_length = fillByteBufferWithUTF8FromString(string, temp_buffer, temp_buffer.length);

        const input_buffer = new Uint8Array(temp_buffer.buffer, 0, actual_length);

        let entry_pointer = 0;

        switch (entry_index) {

            case 0: default: entry_pointer = 67108868; break;
        }

        return run(
            states_buffer,
            input_buffer,
            input_buffer.length,
            entry_pointer,
            scan,
            false
        );
    }
};


const reduce_functions = [(_, s) => s[s.length - 1], (env, sym, pos) => ([sym[0]]) /*0*/,
(env, sym, pos) => ((sym[0].push(sym[2]), sym[0])) /*1*/,
(env, sym, pos) => (sym[0] ? { type: "call", call_id: sym[0], sub_stack: [sym[2]] } : sym[2]) /*2*/,
(env, sym, pos) => (null ? { type: "call", sub_stack: [sym[1]] } : sym[1]) /*3*/,
(env, sym, pos) => ({ type: "call", call_id: sym[0], sub_stack: sym[2] }) /*4*/,
(env, sym, pos) => (sym[0]) /*5*/,
(env, sym, pos) => (sym[0] == "anonymous" ? { type: "location", url: sym[0], pos: sym[1] } : { type: "location", url: new env.URL(sym[0]), pos: sym[1] }) /*6*/,
(env, sym, pos) => (sym[0] == "anonymous" ? { type: "location", url: sym[0] } : { type: "location", url: new env.URL(sym[0]) }) /*7*/,
(env, sym, pos) => ("anonymous") /*8*/,
(env, sym, pos) => ([parseInt(sym[1]), ...sym[2]]) /*9*/,
(env, sym, pos) => ([parseInt(sym[1])]) /*10*/,
(env, sym, pos) => (sym[0] + sym[1] + sym[2]) /*11*/,
(env, sym, pos) => (sym[0] + sym[1]) /*12*/,
(env, sym, pos) => (sym[0] + "") /*13*/];

export default ParserFramework(
    reduce_functions,
    {
        start: 0,
    },
    js_parser_pack,

);

