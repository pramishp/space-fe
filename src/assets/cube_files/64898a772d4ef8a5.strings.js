(function() {
 const messages = JSON.parse("{\"JNyI1Q\":\"Freeform\",\"7SQvOg\":\"Serif\",\"1lOK5Q\":\"Party\",\"Y6WBtw\":\"Formal\",\"wgEXuw\":\"Evergreen\",\"ETTznQ\":\"Distorted\",\"JLlVkw\":\"Chinese (simplified)\",\"yGUNYg\":\"Western\",\"/jrH4Q\":\"Checkers\",\"LpQ4Ww\":\"Videos\",\"BhnkBw\":\"Loud\",\"aPqAHw\":\"Cartoon\",\"IpbBGg\":\"Elegant\",\"hsssRA\":\"Lined\",\"RvDniw\":\"Outline\",\"3jLYtw\":\"Dynamic\",\"6NuOyw\":\"Futuristic\",\"Z3ZVjg\":\"Rough\",\"sJNNmw\":\"Strong\",\"dz2IrA\":\"Display\",\"LQKxzQ\":\"Narrow\",\"RuQINg\":\"Nostalgic\",\"yBjMQA\":\"Arabic\",\"CPirvQ\":\"Neon\",\"aZKMyQ\":\"Paint\",\"CBGVGg\":\"Elegance\",\"lc1TlQ\":\"Geometric\",\"nKvJmw\":\"Freestyle\",\"LXpwKw\":\"Summer\",\"70WYYw\":\"Earth\",\"ZYVbFw\":\"Beach\",\"DLwvCw\":\"Classic\",\"BfFgZw\":\"Greek\",\"SdI7Sw\":\"Got it\",\"R3GrSA\":\"Gold\",\"xjOo/A\":\"Grainy\",\"h1Ji6Q\":\"Creative\",\"aJ05dQ\":\"Calligraphy\",\"fYFcYA\":\"Sorry, we couldn't find any photos. Try searching something related.\",\"I3hE/g\":\"Invitation\",\"f29Dlg\":\"Beige\",\"mWGZ2w\":\"Flyer\",\"XwdCZw\":\"Camera\",\"W5NtkA\":\"Minimalism\",\"TZVmIg\":\"Adorable\",\"FnXxNg\":\"Happy\",\"aGEC7Q\":\"Christmas\",\"8tuDpw\":\"Old-fashioned\",\"hg6BhA\":\"Emphasis\",\"2JYnmg\":\"Old-time\",\"KDO9MA\":\"Devanagari\",\"uHdgPw\":\"Rounded\",\"6KC8Gg\":\"Romantic\",\"i5MELQ\":\"Festive\",\"I2NqLQ\":\"Cyrillic\",\"HJN9IQ\":\"Plain\",\"UvrJoA\":\"You have reached your storage capacity.\",\"co4NVQ\":\"We cannot upload your {0, plural, one {file} other {files}} because you've reached your storage capacity. Try deleting some uploads to free up storage space.\",\"o2KbTw\":\"Floral\",\"cERMUQ\":\"Slab serif\",\"Fc8mmw\":\"Clean\",\"oVFarw\":\"Beautiful\",\"axIDKg\":\"Pink\",\"Ltr1NA\":\"Comic\",\"U5T/Iw\":\"Line\",\"UzQUbQ\":\"Soft\",\"92OJCg\":\"You already have {0, plural, one {a file} other {files}} selected, please remove {0, plural, one {this} other {some files}} and try again.\",\"fNOfjw\":\"Edgy\",\"xleqbg\":\"Celebration\",\"M++Xgg\":\"Red\",\"p2TlIA\":\"We couldn't upload your {0, plural, one {file} other {files}}.\",\"pg/T4A\":\"All\",\"IB2kEQ\":\"Gentle\",\"Jg8dKA\":\"Illustrative\",\"tqjxaA\":\"Innovative\",\"/oNEaA\":\"Curly\",\"S4WXfA\":\"Gothic\",\"UGIr+Q\":\"Dark themed\",\"6yLPFw\":\"Worn\",\"NRsDZQ\":\"Fun\",\"mNXPSA\":\"Want to edit and use your own photos in your Canva designs? Start by enabling file/media permissions from your device settings.\",\"nPcZFg\":\"Dark\",\"jPqqSQ\":\"Thai\",\"QciLEQ\":\"Flow\",\"40IB4A\":\"Young\",\"s8W+Gw\":\"Standard\",\"X1mlCg\":\"Blue\",\"3QY0uA\":\"Sleek\",\"tQZuNw\":\"Circus\",\"JD5jzA\":\"Brush\",\"mbDBmQ\":\"Light\",\"PTjRGQ\":\"Positive\",\"5bT51A\":\"Italic\",\"JZC1Tw\":\"Modern\",\"vKdO5w\":\"Cool\",\"vU5Hew\":\"We cannot upload your {1, plural, one {file} other {files}} because you've reached the file limit. Try uploading {0, plural, one {a single file} other {with fewer than # files}}.\",\"5Cmjuw\":\"Sans serif\",\"KCP2hg\":\"Chrome\",\"TcFz4g\":\"Striking\",\"2SeN2A\":\"Thin\",\"HWJ43g\":\"Art deco\",\"u+qsaA\":\"Khaki\",\"nMx6wQ\":\"Round\",\"ksFKkQ\":\"Hangul\",\"Z8ijbA\":\"Sophisticated\",\"Of0wBw\":\"Imaginative\",\"+rdwww\":\"Chic\",\"caV/tg\":\"Curves\",\"cp2E+g\":\"Fancy\",\"MnUOnA\":\"Gallery\",\"yz2IQg\":\"Esthetic\",\"WP7k7w\":\"Vintage\",\"RfizVA\":\"Grungy\",\"bZwNkA\":\"Rose\",\"3xBE0w\":\"Natural\",\"i48akw\":\"Minimal\",\"HnzFzg\":\"Eid\",\"28Bybg\":\"Arch\",\"Vt079A\":\"Artistic\",\"OO98eQ\":\"Bright\",\"93rGRg\":\"Minimalist\",\"q5Lc+A\":\"Corporate\",\"AsTjdw\":\"Cream\",\"KbaOGQ\":\"Delicate\",\"bQfe2Q\":\"Textured\",\"f6PZWw\":\"Yellow\",\"u218fQ\":\"Playful\",\"ZofwBA\":\"Pretty\",\"F7QK/w\":\"Brown\",\"p7MDRQ\":\"Garden\",\"LjoH3A\":\"Typewriter\",\"fsbC1w\":\"School\",\"CecPyA\":\"Neutral\",\"fe4DdA\":\"Too many files uploaded.\",\"DpwJRA\":\"Organic\",\"xcajDg\":\"Professional\",\"q5RLaA\":\"Girly\",\"p/cy0g\":\"Wide\",\"n/LxHQ\":\"Purple\",\"ffCUaA\":\"Graduation\",\"QvBQ/w\":\"Cheerful\",\"HSoMuQ\":\"Lively\",\"0K4ReA\":\"Profession\",\"+xUz/w\":\"90s\",\"pJOoFA\":\"Funky\",\"/O9xlA\":\"There was an issue uploading your {1, plural, one {file} other {files}}. Check that it's JPEG or PNG format and smaller than {0}MB. Please try another file.\",\"KodCfw\":\"White\",\"GzF8zw\":\"Whimsical\",\"dIOR6w\":\"Telugu\",\"FvLI/A\":\"Dainty\",\"zqsxgw\":\"Ivory\",\"tG7Vpw\":\"Grid\",\"u5DTZg\":\"Trendy\",\"IgwlXA\":\"Maximum of {0} selection\",\"DLGNrQ\":\"Basic\",\"lCR7Gw\":\"Ramadan\",\"PXf1Xg\":\"Blobs\",\"mN/e0g\":\"Pastel\",\"7P8rPw\":\"Vibrant\",\"YbL1uQ\":\"Youthful\",\"pn8tmA\":\"Graffiti\",\"VnEZtA\":\"Event\",\"cOcOeg\":\"Rustic\",\"nxpGpA\":\"Handwriting\",\"Q4fXUg\":\"Nostalgia\",\"WkPCyQ\":\"Balloon\",\"fNT8aA\":\"Cute\",\"4HYnUg\":\"There was an issue uploading your {1, plural, one {file} other {files}}. Check that it's JPEG, PNG or MP4 format and smaller than {0}MB. Please try another file.\",\"cyt2Tw\":\"Posh\",\"Qd+Wqg\":\"Blocks\",\"cwsk7Q\":\"Grant Permissions\",\"ISZkSg\":\"Japanese\",\"/Vn4kQ\":\"Watercolor\",\"3/U7Gw\":\"High-class\",\"jyp2nQ\":\"Blank\",\"iTVoSg\":\"Black\",\"zTScYA\":\"Gritty\",\"08njzQ\":\"Camera Roll\",\"d8todg\":\"Script\",\"6S14QQ\":\"Bold\",\"8wKs8A\":\"Picturesque\",\"h2fz6A\":\"Classy\",\"ldRDsw\":\"Bridal\",\"fUAfCw\":\"Grunge\",\"HkzvQQ\":\"Freeflow\",\"WUJtcA\":\"Monospaced\",\"e6JlZg\":\"Grids\",\"+VaVSg\":\"Images\",\"OI0RQA\":\"Business\",\"FuOfpA\":\"Colorful\",\"YDBBnA\":\"Feminine\",\"i1kRmQ\":\"Free\",\"fpIPkg\":\"Simple\",\"MFms5A\":\"Angsty\",\"XFMYcg\":\"Texture\",\"tbKIpw\":\"Art\",\"luZBmQ\":\"80s\",\"qtTEDA\":\"Apricot\",\"KaLxGQ\":\"Muted\",\"7L7eLA\":\"Wedding\",\"uySEOQ\":\"Stylish\",\"e/+JeA\":\"Old-school\",\"uC23gQ\":\"Yesteryear\",\"ypcqlw\":\"Hebrew\",\"jqQNfw\":\"Outlined\",\"L3+VSg\":\"Retro\",\"2OWeFQ\":\"Latin\",\"LYoKjg\":\"Vivid\",\"01HEnw\":\"Orange\",\"iyfClg\":\"Engagement\",\"SL6uIg\":\"Sports\",\"AXrBOg\":\"Chinese (traditional)\",\"ix7cFQ\":\"Green\"}");
 const cmsg = window["cmsg"] = window["cmsg"] || {};
 const strings = cmsg["strings"] = cmsg["strings"] || {};
 strings["en"] = strings["en"] ? Object.assign(strings["en"], messages) : messages;
})();