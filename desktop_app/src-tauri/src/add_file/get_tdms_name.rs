use std::{collections::HashMap, fs::File, os::windows::fs::FileExt, str::from_utf8};

#[tauri::command(rename_all = "snake_case")]
pub fn get_tdms_name(path_string: &str) -> Result<HashMap<String, String>, String> {
    let file = match File::open(path_string) {
        Ok(f) => f,
        Err(e) => return Err(String::from(format!("Error opening file: {}", e))),
    };
    let mut buffer = [0; 128];
    let _ = file.seek_read(&mut buffer, 0);
    let lead_in_segment = from_utf8(&buffer[0..4]).unwrap();
    let mut bit_mask_vec: Vec<String> = buffer[4..8]
        .iter().clone()
        .map(|byte| format!("{:08b}", byte))
        .collect::<Vec<String>>();
    bit_mask_vec.reverse();
    let bit_mask = bit_mask_vec.join(" ");
    let version_num = u32::from_le_bytes(buffer[8..12].try_into().unwrap());
    let remaining_segment_length = u64::from_le_bytes(buffer[12..20].try_into().unwrap());
    let meta_length = u64::from_le_bytes(buffer[20..28].try_into().unwrap());
    let number_of_objects = u32::from_le_bytes(buffer[28..32].try_into().unwrap());
    let length_of_first_object = u32::from_le_bytes(buffer[32..36].try_into().unwrap());
    let end_path_range = 36 + length_of_first_object as usize;
    let first_path = from_utf8(&buffer[36..end_path_range]).unwrap();
    let properties_for_first_path = u32::from_le_bytes(
        buffer[(end_path_range + 4)..(end_path_range + 8)]
            .try_into()
            .unwrap(),
    );

    println!("lead in segment: {}", lead_in_segment);
    println!("{:?}", &buffer[8..12]);
    println!("bit mask: {}", bit_mask);
    println!("version num: {}", version_num);
    println!("remaining segment length: {}", remaining_segment_length);
    println!("meta length: {}", meta_length);
    println!("number of objects: {}", number_of_objects);
    println!("length of first objects: {}", length_of_first_object);
    println!("first path: {}", first_path);
    let mut starting_index = end_path_range + 8;
    let mut hashmap_to_return = HashMap::<String, String>::new();
    for _ in 0..properties_for_first_path {
        let length_of_prop_name = u32::from_le_bytes(
            buffer[starting_index..(starting_index + 4)]
                .try_into()
                .unwrap(),
        );
        starting_index = starting_index + 4;
        let prop_name =
            from_utf8(&buffer[starting_index..(starting_index + length_of_prop_name as usize)])
                .unwrap();
        starting_index = starting_index + length_of_prop_name as usize;
        starting_index = starting_index + 4;
        let len_of_prop_val = u32::from_le_bytes(
            buffer[starting_index..(starting_index + 4)]
                .try_into()
                .unwrap(),
        );

        starting_index = starting_index + 4;
        let prop_val =
            from_utf8(&buffer[starting_index..(starting_index + len_of_prop_val as usize)])
                .unwrap();

        starting_index = starting_index + len_of_prop_val as usize;
        hashmap_to_return.insert(prop_name.to_string(), prop_val.to_string());
        println!("{}: {}", prop_name, prop_val);
    }
    hashmap_to_return.insert(String::from("TDMS_VERSION"), version_num.to_string());
    hashmap_to_return.insert(String::from("TDMS_BIT_MASK"), bit_mask.clone());

    Ok(hashmap_to_return)
}
