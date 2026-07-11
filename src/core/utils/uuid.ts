const UUID_BYTE_LENGTH = 16;
const VERSION_BYTE_INDEX = 6;
const VERSION_CLEAR_MASK = 0x0f;
const VERSION_4_BITS = 0x40;
const VARIANT_BYTE_INDEX = 8;
const VARIANT_CLEAR_MASK = 0x3f;
const VARIANT_RFC4122_BITS = 0x80;
const HEX_GROUP_LENGTHS = [8, 4, 4, 4, 12] as const;

export function generateUuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();

  const bytes = crypto.getRandomValues(new Uint8Array(UUID_BYTE_LENGTH));
  bytes[VERSION_BYTE_INDEX] = (bytes[VERSION_BYTE_INDEX]! & VERSION_CLEAR_MASK) | VERSION_4_BITS;
  bytes[VARIANT_BYTE_INDEX] = (bytes[VARIANT_BYTE_INDEX]! & VARIANT_CLEAR_MASK) | VARIANT_RFC4122_BITS;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  let offset = 0;
  return HEX_GROUP_LENGTHS.map((length) => {
    const group = hex.slice(offset, offset + length);
    offset += length;
    return group;
  }).join('-');
}
