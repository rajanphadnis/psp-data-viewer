export function bump_minor_id(original_minor_id: string, decrement: boolean = false) {
    const parsed_num = Number.parseFloat(`0.${original_minor_id}`);
    const new_num = decrement ? parsed_num - 0.001 : parsed_num + 0.001;
    const new_num_string = new_num.toFixed(3);
    const to_return = new_num_string.slice(-3);
    return to_return;
}