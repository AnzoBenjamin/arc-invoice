
export function toCommas(value: string) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
