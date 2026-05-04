import { Character } from "./character.js";
import { DamageType } from "./damage_types.js";

window.addEventListener("load", () => {
    init();
});

let v_current_character = new Character();
let v_edit_snapshot = null;
let v_json_loader = null;

function init(){
    v_json_loader = create_json_loader();
    build_stat_block();
    disable_editable_controls();
}

function create_ability_section(){
    const v_abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

    const v_section = document.createElement("div");
    v_section.classList.add("stat_block_element");

    const v_label = document.createElement("div");
    v_label.classList.add("label");
    v_label.textContent = "Abilities";
    v_section.appendChild(v_label);

    const v_table = document.createElement("table");
    
    const v_thead = document.createElement("thead");
    const v_header_row = document.createElement("tr");
    const v_headers = ["Ability", "Score", "Modifier", "Save", "STP"];

    v_headers.forEach(function(v_header_text) {
        const v_th = document.createElement("th");
        v_th.textContent = v_header_text;
        v_header_row.appendChild(v_th);
    });

    v_thead.appendChild(v_header_row);
    v_table.appendChild(v_thead);

    const v_tbody = document.createElement("tbody");

    v_abilities.forEach(function(v_ability_name) {
        const v_prefix = v_ability_name.substring(0, 3).toLowerCase();
        const v_row = document.createElement("tr");

        const v_name_cell = document.createElement("td");
        v_name_cell.textContent = v_ability_name;
        v_row.appendChild(v_name_cell);

        const v_score_cell = document.createElement("td");
        const v_score_id = v_prefix + "_scr";
        const v_score_field = construct_number_field(v_score_id, true);
        const v_score_input = v_score_field.querySelector("input");
        if (v_score_input) {
            v_score_input.value = v_current_character.m_ability_scores[v_prefix] || 0;
        }
        v_score_cell.appendChild(v_score_field);
        v_row.appendChild(v_score_cell);

        const v_mod_cell = document.createElement("td");
        const v_mod_input = document.createElement("input");
        v_mod_input.type = "number";
        v_mod_input.id = v_prefix + "_mod";
        v_mod_input.className = "short_field";
        v_mod_input.disabled = true;
        v_mod_input.value = v_current_character.get_ability_modifier(v_prefix);
        v_mod_cell.appendChild(v_mod_input);
        v_row.appendChild(v_mod_cell);

        const v_save_cell = document.createElement("td");
        const v_save_input = document.createElement("input");
        v_save_input.type = "number";
        v_save_input.id = v_prefix + "_sav";
        v_save_input.className = "short_field";
        v_save_input.disabled = true;
        v_save_input.value = v_current_character.get_saving_throw(v_prefix);
        v_save_cell.appendChild(v_save_input);
        v_row.appendChild(v_save_cell);

        const v_stp_cell = document.createElement("td");
        const v_stp_checkbox = document.createElement("input");
        v_stp_checkbox.type = "checkbox";
        v_stp_checkbox.id = v_prefix + "_stp";
        v_stp_checkbox.className = "editable_attribute";
        v_stp_checkbox.checked = !!v_current_character.m_saving_throws[v_prefix];
        v_stp_cell.appendChild(v_stp_checkbox);
        v_row.appendChild(v_stp_cell);

        v_tbody.appendChild(v_row);
    });

    v_table.appendChild(v_tbody);
    v_section.appendChild(v_table);
    return v_section;
}

function construct_number_field(p_id, p_editable){
    let v_div = document.createElement("div");
    v_div.classList.add("number_field");

    let v_btn_neg_ten = document.createElement("button");
    v_btn_neg_ten.textContent = "-10";
    v_btn_neg_ten.onclick = () => adjust_value(p_id, -10);
    if(p_editable){
        v_btn_neg_ten.classList.add("edit_controller");
    }

    let v_btn_neg_five = document.createElement("button");
    v_btn_neg_five.textContent = "-5";
    v_btn_neg_five.onclick = () => adjust_value(p_id, -5);
    if(p_editable){
        v_btn_neg_five.classList.add("edit_controller");
    }

    let v_btn_neg_one = document.createElement("button");
    v_btn_neg_one.textContent = "-1";
    v_btn_neg_one.onclick = () => adjust_value(p_id, -1);
    if(p_editable){
        v_btn_neg_one.classList.add("edit_controller");
    }

    let v_input = document.createElement("input");
    v_input.type = "number";
    v_input.id = p_id;
    v_input.classList.add("short_field");
    if(p_editable){
        v_input.classList.add("editable_attribute");
    }

    let v_btn_one = document.createElement("button");
    v_btn_one.textContent = "+1";
    v_btn_one.onclick = () => adjust_value(p_id, 1);
    if(p_editable){
        v_btn_one.classList.add("edit_controller");
    }

    let v_btn_five = document.createElement("button");
    v_btn_five.textContent = "+5";
    v_btn_five.onclick = () => adjust_value(p_id, 5);
    if(p_editable){
        v_btn_five.classList.add("edit_controller");
    }

    let v_btn_ten = document.createElement("button");
    v_btn_ten.textContent = "+10";
    v_btn_ten.onclick = () => adjust_value(p_id, 10);
    if(p_editable){
        v_btn_ten.classList.add("edit_controller");
    }

    v_div.appendChild(v_btn_neg_ten);
    v_div.appendChild(v_btn_neg_five);
    v_div.appendChild(v_btn_neg_one);
    v_div.appendChild(v_input);
    v_div.appendChild(v_btn_one);
    v_div.appendChild(v_btn_five);
    v_div.appendChild(v_btn_ten);

    return v_div;
}

function adjust_value(p_id, p_delta){
    let v_input = document.getElementById(p_id);
    if(v_input){
        let v_current = parseInt(v_input.value) || 0;
        let v_new = v_current + p_delta;
        v_input.value = v_new < 0 ? 0 : v_new;
    }
}

function create_field_row(p_label, p_id, p_type, p_value){
    const v_row = document.createElement("div");
    v_row.classList.add("stat_field_row");

    const v_label = document.createElement("label");
    v_label.setAttribute("for", p_id);
    v_label.textContent = p_label;
    v_row.appendChild(v_label);

    const v_input = document.createElement("input");
    v_input.type = p_type;
    v_input.id = p_id;
    v_input.classList.add("editable_attribute");
    v_input.value = p_value;
    if (p_type === "number") {
        v_input.min = "0";
    }
    v_row.appendChild(v_input);

    return v_row;
}

function create_proficiency_bonus_row(){
    const v_row = document.createElement("div");
    v_row.classList.add("stat_field_row");

    const v_label = document.createElement("label");
    v_label.setAttribute("for", "character_proficiency_bonus");
    v_label.textContent = "Proficiency Bonus";
    v_row.appendChild(v_label);

    const v_input = document.createElement("input");
    v_input.type = "number";
    v_input.id = "character_proficiency_bonus";
    v_input.classList.add("short_field");
    v_input.disabled = true;
    v_input.value = v_current_character.get_proficiency_bonus();
    v_row.appendChild(v_input);

    return v_row;
}

function create_initiative_row(){
    const v_row = document.createElement("div");
    v_row.classList.add("stat_field_row");

    const v_label = document.createElement("label");
    v_label.setAttribute("for", "character_initiative");
    v_label.textContent = "Initiative";
    v_row.appendChild(v_label);

    const v_input = document.createElement("input");
    v_input.type = "number";
    v_input.id = "character_initiative";
    v_input.classList.add("short_field");
    v_input.disabled = true;
    v_input.value = v_current_character.get_initiative();
    v_row.appendChild(v_input);

    return v_row;
}

function build_stat_block(){
    const v_stat_block = document.getElementById("stat_block");
    if (!v_stat_block) {
        return;
    }

    v_stat_block.innerHTML = "";
    v_stat_block.appendChild(create_control_row());
    v_stat_block.appendChild(create_character_info_section());
    v_stat_block.appendChild(create_ability_section());
    v_stat_block.appendChild(create_damage_type_modifier_section());
    bind_stat_block_buttons();
}

function bind_stat_block_buttons(){
    const v_edit_button = document.getElementById("edit_button");
    const v_apply_button = document.getElementById("apply_button");
    const v_revert_button = document.getElementById("revert_button");
    const v_save_button = document.getElementById("save_json_button");
    const v_load_button = document.getElementById("load_json_button");

    if (v_edit_button) {
        v_edit_button.addEventListener("click", enter_edit_mode);
    }
    if (v_apply_button) {
        v_apply_button.addEventListener("click", apply_edit_mode);
    }
    if (v_revert_button) {
        v_revert_button.addEventListener("click", revert_edit_mode);
    }
    if (v_save_button) {
        v_save_button.addEventListener("click", save_current_character_to_json);
    }
    if (v_load_button) {
        v_load_button.addEventListener("click", () => v_json_loader.click());
    }
}

function create_control_row(){
    const v_row = document.createElement("div");
    v_row.classList.add("stat_block_element", "edit_controls");

    const v_edit_button = document.createElement("button");
    v_edit_button.id = "edit_button";
    v_edit_button.type = "button";
    v_edit_button.textContent = "Edit";

    const v_apply_button = document.createElement("button");
    v_apply_button.id = "apply_button";
    v_apply_button.type = "button";
    v_apply_button.textContent = "Apply";
    v_apply_button.classList.add("hidden");

    const v_revert_button = document.createElement("button");
    v_revert_button.id = "revert_button";
    v_revert_button.type = "button";
    v_revert_button.textContent = "Revert";
    v_revert_button.classList.add("hidden");

    const v_save_button = document.createElement("button");
    v_save_button.id = "save_json_button";
    v_save_button.type = "button";
    v_save_button.textContent = "Save";

    const v_load_button = document.createElement("button");
    v_load_button.id = "load_json_button";
    v_load_button.type = "button";
    v_load_button.textContent = "Load";

    v_row.appendChild(v_edit_button);
    v_row.appendChild(v_apply_button);
    v_row.appendChild(v_revert_button);
    v_row.appendChild(v_save_button);
    v_row.appendChild(v_load_button);

    return v_row;
}

function create_character_info_section(){
    const v_section = document.createElement("div");
    v_section.classList.add("stat_block_element");

    const v_label = document.createElement("div");
    v_label.classList.add("label");
    v_label.textContent = "Character details";
    v_section.appendChild(v_label);

    const v_value_container = document.createElement("div");
    v_value_container.classList.add("stat_field_group");

    v_value_container.appendChild(create_field_row("Name", "character_name", "text", v_current_character.m_name));
    v_value_container.appendChild(create_field_row("Level", "character_level", "number", v_current_character.m_level));
    v_value_container.appendChild(create_field_row("Speed", "character_speed", "number", v_current_character.m_speed));
    v_value_container.appendChild(create_field_row("Armor Class", "character_armor_class", "number", v_current_character.m_armor_class));
    v_value_container.appendChild(create_field_row("Hit Points", "character_hitpoints", "number", v_current_character.m_hitpoints));
    v_value_container.appendChild(create_field_row("Hit Point Maximum", "character_hitpoint_maximum", "number", v_current_character.m_hitpoint_maximum));
    v_value_container.appendChild(create_field_row("Temporary Hit Points", "character_temporary_hitpoints", "number", v_current_character.m_temporary_hitpoints));
    v_value_container.appendChild(create_initiative_row());
    v_value_container.appendChild(create_proficiency_bonus_row());

    v_section.appendChild(v_value_container);
    return v_section;
}

function update_character_from_ui(){
    const v_name_input = document.getElementById("character_name");
    const v_level_input = document.getElementById("character_level");
    const v_speed_input = document.getElementById("character_speed");
    const v_ac_input = document.getElementById("character_armor_class");
    const v_hp_input = document.getElementById("character_hitpoints");
    const v_hp_max_input = document.getElementById("character_hitpoint_maximum");
    const v_temp_hp_input = document.getElementById("character_temporary_hitpoints");

    if (v_name_input) {
        v_current_character.m_name = v_name_input.value;
    }
    if (v_level_input) {
        v_current_character.m_level = parseInt(v_level_input.value, 10) || 1;
    }
    if (v_speed_input) {
        v_current_character.m_speed = parseInt(v_speed_input.value, 10) || 0;
    }
    if (v_ac_input) {
        v_current_character.m_armor_class = parseInt(v_ac_input.value, 10) || 0;
    }
    if (v_hp_input) {
        v_current_character.m_hitpoints = parseInt(v_hp_input.value, 10) || 0;
    }
    if (v_hp_max_input) {
        v_current_character.m_hitpoint_maximum = parseInt(v_hp_max_input.value, 10) || 0;
    }
    if (v_temp_hp_input) {
        v_current_character.m_temporary_hitpoints = parseInt(v_temp_hp_input.value, 10) || 0;
    }

    ["str", "dex", "con", "int", "wis", "cha"].forEach((v_prefix) => {
        const v_score_input = document.getElementById(`${v_prefix}_scr`);
        const v_stp_input = document.getElementById(`${v_prefix}_stp`);

        if (v_score_input) {
            v_current_character.m_ability_scores[v_prefix] = parseInt(v_score_input.value, 10) || 0;
        }
        if (v_stp_input) {
            v_current_character.m_saving_throws[v_prefix] = v_stp_input.checked;
        }
    });

    v_current_character.m_resistances = [];
    v_current_character.m_immunities = [];
    v_current_character.m_vulnerabilities = [];

    DamageType.get_all_damage_types().forEach((v_damage_type) => {
        const v_group_name = `damage_modifier_${v_damage_type.toLowerCase().replace(/\s+/g, "_")}`;
        const v_selected = document.querySelector(`input[name="${v_group_name}"]:checked`);
        if (v_selected) {
            switch (v_selected.value) {
                case "resist":
                    v_current_character.m_resistances.push(v_damage_type);
                    break;
                case "immune":
                    v_current_character.m_immunities.push(v_damage_type);
                    break;
                case "vulnerable":
                    v_current_character.m_vulnerabilities.push(v_damage_type);
                    break;
            }
        }
    });
}

function refresh_derived_values(){
    const v_proficiency_bonus_input = document.getElementById("character_proficiency_bonus");
    const v_initiative_input = document.getElementById("character_initiative");
    if (v_proficiency_bonus_input) {
        v_proficiency_bonus_input.value = v_current_character.get_proficiency_bonus();
    }
    if (v_initiative_input) {
        v_initiative_input.value = v_current_character.get_initiative();
    }

    ["str", "dex", "con", "int", "wis", "cha"].forEach((v_prefix) => {
        const v_mod_input = document.getElementById(`${v_prefix}_mod`);
        const v_save_input = document.getElementById(`${v_prefix}_sav`);

        if (v_mod_input) {
            v_mod_input.value = v_current_character.get_ability_modifier(v_prefix);
        }
        if (v_save_input) {
            v_save_input.value = v_current_character.get_saving_throw(v_prefix);
        }
    });
}

function create_json_loader(){
    const v_input = document.createElement("input");
    v_input.type = "file";
    v_input.accept = "application/json";
    v_input.style.display = "none";
    v_input.addEventListener("change", handle_json_file_selection);
    document.body.appendChild(v_input);
    return v_input;
}

function handle_json_file_selection(event){
    const v_file = event.target.files && event.target.files[0];
    if (!v_file) {
        return;
    }

    const v_reader = new FileReader();
    v_reader.onload = (e) => {
        try {
            v_current_character = Character.from_json(e.target.result);
            build_stat_block();
            disable_editable_controls();
            update_edit_mode_buttons(false);
        } catch (error) {
            console.error("Failed to load character JSON", error);
        }
    };
    v_reader.readAsText(v_file);
    event.target.value = "";
}

function save_current_character_to_json(){
    update_character_from_ui();
    const v_json = v_current_character.to_json();
    const v_blob = new Blob([v_json], { type: "application/json" });
    const v_link = document.createElement("a");
    v_link.href = URL.createObjectURL(v_blob);
    v_link.download = "character.json";
    document.body.appendChild(v_link);
    v_link.click();
    document.body.removeChild(v_link);
    URL.revokeObjectURL(v_link.href);
}

function get_damage_type_setting(p_damage_type){
    if (v_current_character.m_immunities.includes(p_damage_type)) {
        return "immune";
    }
    if (v_current_character.m_resistances.includes(p_damage_type)) {
        return "resist";
    }
    if (v_current_character.m_vulnerabilities.includes(p_damage_type)) {
        return "vulnerable";
    }
    return "none";
}

function create_damage_type_modifier_section(){
    const v_section = document.createElement("div");
    v_section.classList.add("stat_block_element", "edit_controller");

    const v_label = document.createElement("div");
    v_label.classList.add("label");
    v_label.textContent = "Damage type modifiers";
    v_section.appendChild(v_label);

    const v_table = document.createElement("table");
    const v_thead = document.createElement("thead");
    const v_header_row = document.createElement("tr");
    ["Damage Type", "None", "Resist", "Immune", "Vulnerable"].forEach((v_header_text) => {
        const v_th = document.createElement("th");
        v_th.textContent = v_header_text;
        v_header_row.appendChild(v_th);
    });
    v_thead.appendChild(v_header_row);
    v_table.appendChild(v_thead);

    const v_tbody = document.createElement("tbody");
    DamageType.get_all_damage_types().forEach((v_damage_type) => {
        v_tbody.appendChild(construct_damage_type_modifier_row(v_damage_type));
    });
    v_table.appendChild(v_tbody);

    v_section.appendChild(v_table);
    return v_section;
}

function construct_damage_type_modifier_row(p_damage_type){
    const v_row = document.createElement("tr");

    const v_type_cell = document.createElement("td");
    v_type_cell.textContent = p_damage_type;
    v_type_cell.classList.add("damage_modifier_type");
    v_row.appendChild(v_type_cell);

    const v_group_name = `damage_modifier_${p_damage_type.toLowerCase().replace(/\s+/g, "_")}`;
    const v_options = [
        { value: "none", label: "None" },
        { value: "resist", label: "Resist" },
        { value: "immune", label: "Immune" },
        { value: "vulnerable", label: "Vulnerable" }
    ];

    const v_current_setting = get_damage_type_setting(p_damage_type);

    v_options.forEach((v_option) => {
        const v_radio_cell = document.createElement("td");

        const v_radio = document.createElement("input");
        v_radio.type = "radio";
        v_radio.name = v_group_name;
        v_radio.id = `${v_group_name}_${v_option.value}`;
        v_radio.value = v_option.value;
        v_radio.classList.add("editable_attribute");
        v_radio.setAttribute("aria-label", `${p_damage_type} ${v_option.label}`);
        v_radio.checked = v_current_setting === v_option.value;

        v_radio_cell.appendChild(v_radio);
        v_row.appendChild(v_radio_cell);
    });

    return v_row;
}

function set_editable_controls_enabled(p_enabled){
    // Enable/disable editable attributes (inputs) - keep visible but disabled
    const v_editable_elements = document.querySelectorAll(".editable_attribute");
    v_editable_elements.forEach((element) => {
        if ("disabled" in element) {
            element.disabled = !p_enabled;
        }
    });

    // Show/hide edit controllers (buttons and sections) - hide when disabled
    const v_controller_elements = document.querySelectorAll(".edit_controller");
    v_controller_elements.forEach((element) => {
        element.style.display = p_enabled ? "" : "none";
    });
}

function get_editable_attribute_elements(){
    return Array.from(document.querySelectorAll(".editable_attribute"));
}

function snapshot_editable_attributes(){
    return get_editable_attribute_elements().map((element) => ({
        id: element.id,
        type: element.type,
        value: element.value,
        checked: element.type === "checkbox" ? element.checked : undefined
    }));
}

function restore_editable_attributes(snapshot){
    snapshot.forEach((item) => {
        const element = document.getElementById(item.id);
        if (!element) {
            return;
        }

        if (item.type === "checkbox") {
            element.checked = item.checked;
        } else {
            element.value = item.value;
        }
    });
}

function enter_edit_mode(){
    v_edit_snapshot = snapshot_editable_attributes();
    enable_editable_controls();
    update_edit_mode_buttons(true);
}

function apply_edit_mode(){
    update_character_from_ui();
    v_edit_snapshot = null;
    refresh_derived_values();
    disable_editable_controls();
    update_edit_mode_buttons(false);
}

function revert_edit_mode(){
    if (v_edit_snapshot){
        restore_editable_attributes(v_edit_snapshot);
    }
    v_edit_snapshot = null;
    disable_editable_controls();
    update_edit_mode_buttons(false);
}

function update_edit_mode_buttons(p_editing){
    const v_edit_button = document.getElementById("edit_button");
    const v_apply_button = document.getElementById("apply_button");
    const v_revert_button = document.getElementById("revert_button");

    if (v_edit_button) {
        v_edit_button.classList.toggle("hidden", p_editing);
    }
    if (v_apply_button) {
        v_apply_button.classList.toggle("hidden", !p_editing);
    }
    if (v_revert_button) {
        v_revert_button.classList.toggle("hidden", !p_editing);
    }
}

function enable_editable_controls(){
    set_editable_controls_enabled(true);
}

function disable_editable_controls(){
    set_editable_controls_enabled(false);
}