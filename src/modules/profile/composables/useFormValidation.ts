import { ref } from 'vue';

export function useFormValidation() {
  const submitted = ref(false);

  function isPositive(value: number | null | undefined): boolean {
    return value !== null && value !== undefined && value > 0;
  }

  function markSubmitted() {
    submitted.value = true;
  }

  return { submitted, isPositive, markSubmitted };
}
