<script lang="ts">
  import { Input, Label, FormText } from "@sveltestrap/sveltestrap";
  
  export let label: string;
  export let name: string;
  export let type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'select' | 'textarea' = 'text';
  export let value: string | number = '';
  export let placeholder: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let invalid: boolean = false;
  export let feedback: string = '';
  export let helpText: string = '';
  export let options: Array<{ value: string | number; label: string }> = [];
  export let rows: number = 3;
  export let maxLength: number | undefined = undefined;
  export let minLength: number | undefined = undefined;
  export let pattern: string | undefined = undefined;
  
  // Event dispatchers
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    dispatch('input', { value: target.value, name });
  }
  
  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    dispatch('change', { value: target.value, name });
  }
</script>

<div class="form-field mb-3">
  <Label for={name} class="form-label">
    {#if required}
      <span class="text-danger">*</span>
    {/if}
    {label}
  </Label>
  
  {#if type === 'select'}
    <select
      id={name}
      name={name}
      class="form-select"
      class:is-invalid={invalid}
      {required}
      {disabled}
      {value}
      on:input={handleInput}
      on:change={handleChange}
    >
      <option value="">Seçiniz</option>
      {#each options as option}
        <option value={option.value} selected={value == option.value}>
          {option.label}
        </option>
      {/each}
    </select>
  {:else if type === 'textarea'}
    <textarea
      id={name}
      name={name}
      class="form-control"
      class:is-invalid={invalid}
      {placeholder}
      {required}
      {disabled}
      {rows}
      {maxLength}
      {minLength}
      {pattern}
      on:input={handleInput}
      on:change={handleChange}
    >{value}</textarea>
  {:else}
    <Input
      {id}
      {name}
      {type}
      {placeholder}
      {required}
      {disabled}
      {invalid}
      {maxLength}
      {minLength}
      {pattern}
      bind:value
      on:input={handleInput}
      on:change={handleChange}
    />
  {/if}
  
  {#if feedback && invalid}
    <FormText color="danger">{feedback}</FormText>
  {/if}
  
  {#if helpText}
    <FormText color="muted">{helpText}</FormText>
  {/if}
</div>

<style>
  .form-field .form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .form-field .form-control,
  .form-field .form-select,
  .form-field textarea {
    border-radius: 0.375rem;
    border: 1px solid var(--bs-border-color);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  
  .form-field .form-control:focus,
  .form-field .form-select:focus,
  .form-field textarea:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
  }
  
  .form-field .is-invalid {
    border-color: var(--bs-danger);
  }
  
  .form-field .is-invalid:focus {
    border-color: var(--bs-danger);
    box-shadow: 0 0 0 0.2rem rgba(var(--bs-danger-rgb), 0.25);
  }
</style> 