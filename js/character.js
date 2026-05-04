export class Character{
    m_name = "New Character";
    m_level = 1;
    m_speed = 30;
    m_hitpoints = 10;
    m_hitpoint_maximum = 10;
    m_temporary_hitpoints = 0;
    m_armor_class = 10;
    m_ability_scores = {
        "str": 10,
        "dex": 10,
        "con": 10,
        "int": 10,
        "wis": 10,
        "cha": 10
    };
    m_saving_throws = {
        "str": false,
        "dex": false,
        "con": false,
        "int": false,
        "wis": false,
        "cha": false
    };
    m_resistances = [];
    m_vulnerabilities = [];
    m_immunities = [];

    constructor(){

    }

    static get_modifier(p_score){
        return Math.floor((p_score - 10) / 2);
    }

    get_ability_modifier(p_ability){
        return Character.get_modifier(this.m_ability_scores[p_ability]);
    }

    get_proficiency_bonus(){
        return Math.ceil(this.m_level / 4) + 1;
    }

    get_saving_throw(p_ability){
        const v_modifier = this.get_ability_modifier(p_ability);
        const v_proficiency_bonus = this.get_proficiency_bonus();
        const v_is_proficient = this.m_saving_throws[p_ability];
        return v_modifier + (v_is_proficient ? v_proficiency_bonus : 0);
    }

    get_initiative(){
        return this.get_ability_modifier("dex");
    }

    to_object(){
        return {
            m_name: this.m_name,
            m_level: this.m_level,
            m_speed: this.m_speed,
            m_hitpoints: this.m_hitpoints,
            m_hitpoint_maximum: this.m_hitpoint_maximum,
            m_temporary_hitpoints: this.m_temporary_hitpoints,
            m_armor_class: this.m_armor_class,
            m_ability_scores: { ...this.m_ability_scores },
            m_saving_throws: { ...this.m_saving_throws },
            m_resistances: [ ...this.m_resistances ],
            m_vulnerabilities: [ ...this.m_vulnerabilities ],
            m_immunities: [ ...this.m_immunities ]
        };
    }

    to_json(){
        return JSON.stringify(this.to_object(), null, 2);
    }

    static from_object(p_data){
        const v_character = new Character();
        if (p_data.m_name !== undefined) v_character.m_name = p_data.m_name;
        if (p_data.m_level !== undefined) v_character.m_level = p_data.m_level;
        if (p_data.m_speed !== undefined) v_character.m_speed = p_data.m_speed;
        if (p_data.m_hitpoints !== undefined) v_character.m_hitpoints = p_data.m_hitpoints;
        if (p_data.m_hitpoint_maximum !== undefined) v_character.m_hitpoint_maximum = p_data.m_hitpoint_maximum;
        if (p_data.m_temporary_hitpoints !== undefined) v_character.m_temporary_hitpoints = p_data.m_temporary_hitpoints;
        if (p_data.m_armor_class !== undefined) v_character.m_armor_class = p_data.m_armor_class;
        if (p_data.m_ability_scores !== undefined) v_character.m_ability_scores = { ...v_character.m_ability_scores, ...p_data.m_ability_scores };
        if (p_data.m_saving_throws !== undefined) v_character.m_saving_throws = { ...v_character.m_saving_throws, ...p_data.m_saving_throws };
        if (Array.isArray(p_data.m_resistances)) v_character.m_resistances = [ ...p_data.m_resistances ];
        if (Array.isArray(p_data.m_vulnerabilities)) v_character.m_vulnerabilities = [ ...p_data.m_vulnerabilities ];
        if (Array.isArray(p_data.m_immunities)) v_character.m_immunities = [ ...p_data.m_immunities ];
        return v_character;
    }

    static from_json(p_json){
        const v_data = typeof p_json === "string" ? JSON.parse(p_json) : p_json;
        return Character.from_object(v_data);
    }
}