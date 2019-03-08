module.exports = 
{
get_stage: async function(pool, discord_msg, content) {
    if (content == 'starter') {
        discord_msg.channel.send(get_starter_stage());
    }
    else if (content == 'starter stages') {
        discord_msg.channel.send(get_starter_stages());
    }
    else if (content == 'counter stages') {
        discord_msg.channel.send(get_counter_stages());
    }
}

function get_starter_stage() {
    var valid_stages = [for (s of stages) if (stages.is_starter)];
    idx = Math.floor(Math.random() * valid_stages.length);
    return valid_stages[idx];
}

function get_starter_stages() {
    var valid_stages = [for (s of stages) if (stages.is_starter)];
    return valid_stages;
}

function get_counter_stages() {
    var valid_standard_stages = [for (s of stages) if (stages.standard_legality)];
    var valid_alternative_stages = [for (s of stages) if (stages.alt_legality)];
    var valid_stages = {
        'standard': valid_standard_stages,
        'althernative': valid_alternative_stages
    };
    return valid_stages;
}

var stage(name, standard_legality, alt_legality, is_starter) {
    this.name = name;
    this.standard_legality = standard_legality;
    this.alt_legality = alt_legality;
    this.is_starter = is_starter;
}

var stages = [
    stage('3D Land', false, false, false),
    stage('75m', false, false, false),
    stage('Arena Ferox', false, true, false),
    stage('Balloon Fight', false, false, false),
    stage('Battlefield (SSBU)', true, true, true),
    stage('Big Battlefield (SSBU)', false, false, false),
    stage('Big Blue', false, false, false),
    stage('Boxing Ring', false, false, false),
    stage('Bridge of Eldin', false, false, false),
    stage('Brinstar', false, false, false),
    stage('Brinstar Depths', false, false, false),
    stage('Castle Siege', false, true, false),
    stage('Coliseum', false, false, false),
    stage('Corneria', false, true, false),
    stage('Delfino Plaza', false, true, false),
    stage('Distant Planet', false, false, false),
    stage('Draculas Castle', false, false, false),
    stage('Dream Land (SSB)', false, true, false),
    stage('Dream Land GB', false, false, false),
    stage('Duck Hunt (stage)', false, false, false),
    stage('Figure-8 Circuit', false, false, false),
    stage('Final Destination (SSBU)', true, true, true),
    stage('Find Mii', false, false, false),
    stage('Flat Zone X', false, false, false),
    stage('Fountain of Dreams', false, false, false),
    stage('Fourside', false, false, false),
    stage('Frigate Orpheon', false, true, false),
    stage('Gamer', false, false, false),
    stage('Garden of Hope', false, false, false),
    stage('Gaur Plain', false, false, false),
    stage('Gerudo Valley', false, false, false),
    stage('Golden Plains', false, false, false),
    stage('Great Bay', false, false, false),
    stage('Great Plateau Tower', false, true, false),
    stage('Green Greens', false, false, false),
    stage('Green Hill Zone', false, false, false),
    stage('Halberd', false, true, false),
    stage('Hanenbow', false, false, false),
    stage('Hyrule Castle', false, false, false),
    stage('Jungle Japes', false, false, false),
    stage('Kalos Pokémon League', false, true, false),
    stage('Kongo Falls', false, true, false),
    stage('Kongo Jungle (SSB)', false, true, false),
    stage('Living Room', false, false, false),
    stage('Luigis Mansion', false, false, false),
    stage('Lylat Cruise', true, true, true),
    stage('Magicant', false, false, false),
    stage('Mario Bros.', false, false, false),
    stage('Mario Circuit (SSB4)', false, false, false),
    stage('Mario Galaxy', false, false, false),
    stage('Midgar', false, false, false),
    stage('Moray Towers', false, true, false),
    stage('Mushroom Kingdom (SSB)', false, false, false),
    stage('Mushroom Kingdom II', false, false, false),
    stage('Mushroom Kingdom U', false, false, false),
    stage('Mushroomy Kingdom', false, false, false),
    stage('Mute City SNES', false, false, false),
    stage('New Donk City Hall', false, true, false),
    stage('New Pork City', false, false, false),
    stage('Norfair', false, false, false),
    stage('Onett', false, false, false),
    stage('Pac-Land', false, false, false),
    stage('Palutenas Temple', false, false, false),
    stage('Paper Mario', false, false, false),
    stage('Past Stages', false, false, false),
    stage('Peachs Castle', false, true, false),
    stage('PictoChat 2', false, false, false),
    stage('Pilotwings', false, false, false),
    stage('Pirate Ship', false, false, false),
    stage('Pokémon Stadium', false, true, false),
    stage('Pokémon Stadium 2', true, true, true),
    stage('Port Town Aero Dive', false, false, false),
    stage('Princess Peachs Castle', false, false, false),
    stage('Prism Tower', false, false, false),
    stage('Rainbow Cruise', false, false, false),
    stage('Reset Bomb Forest', false, true, false),
    stage('Saffron City', false, false, false),
    stage('Shadow Moses Island', false, false, false),
    stage('Skyloft', false, true, false),
    stage('Skyworld', false, false, false),
    stage('Smashville', true, true, true),
    stage('Spear Pillar', false, false, false),
    stage('Spirit Train', false, false, false),
    stage('Stage', false, false, false),
    stage('Summit', false, false, false),
    stage('Super Happy Tree', false, true, false),
    stage('Super Mario Maker', false, false, false),
    stage('Suzaku Castle', false, true, false),
    stage('Temple', false, false, false),
    stage('The Great Cave Offensive', false, false, false),
    stage('Tomodachi Life', false, false, false),
    stage('Tortimer Island', false, false, false),
    stage('Town and City', false, true, false),
    stage('Training (stage)', false, false, false),
    stage('Umbra Clock Tower', false, true, false),
    stage('Unova Pokémon League', false, false, false),
    stage('Venom', false, true, false),
    stage('WarioWare, Inc.', false, false, false),
    stage('Wii Fit Studio', false, false, false),
    stage('Wily Castle', false, false, false),
    stage('Windy Hill Zone', false, false, false),
    stage('Wrecking Crew', false, false, false),
    stage('Wuhu Island', false, false, false),
    stage('Yoshis Island (SSBB)', false, true, false),
    stage('Yoshis Island (SSBM)', false, false, false),
    stage('Yoshis Story', false, true, false),
];