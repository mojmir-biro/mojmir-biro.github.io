export class DamageType {
    static ACID = "Acid";
    static BLUDGEONING = "Bludgeoning";
    static COLD = "Cold";
    static FIRE = "Fire";
    static FORCE = "Force";
    static LIGHTNING = "Lightning";
    static NECROTIC = "Necrotic";
    static PIERCING = "Piercing";
    static POISON = "Poison";
    static PSYCHIC = "Psychic";
    static RADIANT = "Radiant";
    static SLASHING = "Slashing";
    static THUNDER = "Thunder";

    static get_all_damage_types() {
        return [
            DamageType.ACID,
            DamageType.BLUDGEONING,
            DamageType.COLD,
            DamageType.FIRE,
            DamageType.FORCE,
            DamageType.LIGHTNING,
            DamageType.NECROTIC,
            DamageType.PIERCING,
            DamageType.POISON,
            DamageType.PSYCHIC,
            DamageType.RADIANT,
            DamageType.SLASHING,
            DamageType.THUNDER
        ];
    }

    static is_valid_damage_type(p_damage_type) {
        return DamageType.get_all_damage_types().includes(p_damage_type);
    }
}

Object.freeze(DamageType);
