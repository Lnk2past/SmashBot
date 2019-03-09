module.exports = 
{
get_stage: async function(pool, discord_msg, content) {
    if (content == 'starter') {
        ret = get_starter_stage();
    }
    else if (content == 'starter stages') {
        ret = get_starter_stages();
    }
    else if (content == 'counter stages') {
        ret = get_counter_stages();
    }
    discord_msg.channel.send('```' + ret + '```');
}
};

function stage(name, standard_legality, alt_legality, is_starter) {
    this.name = name;
    this.standard_legality = standard_legality;
    this.alt_legality = alt_legality;
    this.is_starter = is_starter;
}

var stages = [
    new stage('3D Land', false, false, false),
    new stage('75m', false, false, false),
    new stage('Arena Ferox', false, true, false),
    new stage('Balloon Fight', false, false, false),
    new stage('Battlefield (SSBU)', true, true, true),
    new stage('Big Battlefield (SSBU)', false, false, false),
    new stage('Big Blue', false, false, false),
    new stage('Boxing Ring', false, false, false),
    new stage('Bridge of Eldin', false, false, false),
    new stage('Brinstar', false, false, false),
    new stage('Brinstar Depths', false, false, false),
    new stage('Castle Siege', true, true, false),
    new stage('Coliseum', false, false, false),
    new stage('Corneria', false, true, false),
    new stage('Delfino Plaza', false, true, false),
    new stage('Distant Planet', false, false, false),
    new stage('Draculas Castle', false, false, false),
    new stage('Dream Land (SSB)', false, true, false),
    new stage('Dream Land GB', false, false, false),
    new stage('Duck Hunt (stage)', false, false, false),
    new stage('Figure-8 Circuit', false, false, false),
    new stage('Final Destination (SSBU)', true, true, true),
    new stage('Find Mii', false, false, false),
    new stage('Flat Zone X', false, false, false),
    new stage('Fountain of Dreams', false, false, false),
    new stage('Fourside', false, false, false),
    new stage('Frigate Orpheon', false, true, false),
    new stage('Gamer', false, false, false),
    new stage('Garden of Hope', false, false, false),
    new stage('Gaur Plain', false, false, false),
    new stage('Gerudo Valley', false, false, false),
    new stage('Golden Plains', false, false, false),
    new stage('Great Bay', false, false, false),
    new stage('Great Plateau Tower', false, true, false),
    new stage('Green Greens', false, false, false),
    new stage('Green Hill Zone', false, false, false),
    new stage('Halberd', false, true, false),
    new stage('Hanenbow', false, false, false),
    new stage('Hyrule Castle', false, false, false),
    new stage('Jungle Japes', false, false, false),
    new stage('Kalos Pokémon League', true, true, false),
    new stage('Kongo Falls', false, true, false),
    new stage('Kongo Jungle (SSB)', false, true, false),
    new stage('Living Room', false, false, false),
    new stage('Luigis Mansion', false, false, false),
    new stage('Lylat Cruise', true, true, true),
    new stage('Magicant', false, false, false),
    new stage('Mario Bros.', false, false, false),
    new stage('Mario Circuit (SSB4)', false, false, false),
    new stage('Mario Galaxy', false, false, false),
    new stage('Midgar', false, false, false),
    new stage('Moray Towers', false, true, false),
    new stage('Mushroom Kingdom (SSB)', false, false, false),
    new stage('Mushroom Kingdom II', false, false, false),
    new stage('Mushroom Kingdom U', false, false, false),
    new stage('Mushroomy Kingdom', false, false, false),
    new stage('Mute City SNES', false, false, false),
    new stage('New Donk City Hall', false, true, false),
    new stage('New Pork City', false, false, false),
    new stage('Norfair', false, false, false),
    new stage('Onett', false, false, false),
    new stage('Pac-Land', false, false, false),
    new stage('Palutenas Temple', false, false, false),
    new stage('Paper Mario', false, false, false),
    new stage('Past Stages', false, false, false),
    new stage('Peachs Castle', false, true, false),
    new stage('PictoChat 2', false, false, false),
    new stage('Pilotwings', false, false, false),
    new stage('Pirate Ship', false, false, false),
    new stage('Pokémon Stadium', false, true, false),
    new stage('Pokémon Stadium 2', true, true, true),
    new stage('Port Town Aero Dive', false, false, false),
    new stage('Princess Peachs Castle', false, false, false),
    new stage('Prism Tower', false, false, false),
    new stage('Rainbow Cruise', false, false, false),
    new stage('Reset Bomb Forest', false, true, false),
    new stage('Saffron City', false, false, false),
    new stage('Shadow Moses Island', false, false, false),
    new stage('Skyloft', false, true, false),
    new stage('Skyworld', false, false, false),
    new stage('Smashville', true, true, true),
    new stage('Spear Pillar', false, false, false),
    new stage('Spirit Train', false, false, false),
    new stage('Stage', false, false, false),
    new stage('Summit', false, false, false),
    new stage('Super Happy Tree', false, true, false),
    new stage('Super Mario Maker', false, false, false),
    new stage('Suzaku Castle', false, true, false),
    new stage('Temple', false, false, false),
    new stage('The Great Cave Offensive', false, false, false),
    new stage('Tomodachi Life', false, false, false),
    new stage('Tortimer Island', false, false, false),
    new stage('Town and City', true, true, false),
    new stage('Training (stage)', false, false, false),
    new stage('Umbra Clock Tower', false, true, false),
    new stage('Unova Pokémon League', true, true, false),
    new stage('Venom', false, true, false),
    new stage('WarioWare, Inc.', false, false, false),
    new stage('Wii Fit Studio', false, false, false),
    new stage('Wily Castle', false, false, false),
    new stage('Windy Hill Zone', false, false, false),
    new stage('Wrecking Crew', false, false, false),
    new stage('Wuhu Island', false, false, false),
    new stage('Yoshis Island (SSBB)', true, true, false),
    new stage('Yoshis Island (SSBM)', false, false, false),
    new stage('Yoshis Story', true, true, false),
];

function get_starter_stage() {
    var valid_stages = stages.filter( (s) => s.is_starter );
    idx = Math.floor(Math.random() * valid_stages.length);
    return valid_stages[idx].name;
}

function get_starter_stages() {
    var valid_stages = stages.filter( (s) => s.is_starter );
    var str = '';
    for (s of valid_stages) {
        str += s.name + '\n';
    }
    return str;
}

function get_counter_stages() {
    var valid_standard_stages = stages.filter( (s) => s.standard_legality );
    var valid_alternative_stages = stages.filter( (s) => s.alt_legality );

    var str = '';
    for (s of valid_standard_stages) {
        str += s.name + '\n';
    }
    for (s of valid_alternative_stages) {
        str += 'Alternative: ' + s.name + '\n';
    }
    return str;
}
