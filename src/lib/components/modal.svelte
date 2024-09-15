<script>
    export let title = 'Modal Title';
    export let isOpen = false;
    export let closeModal;
  </script>
  
  {#if isOpen}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div class="flex justify-between items-center border-b pb-2 mb-4">
          <h2 class="text-xl font-bold">{title}</h2>
          <button class="text-gray-500 hover:text-gray-800" on:click={closeModal}>✖</button>
        </div>
        <slot />
      </div>
    </div>
  {/if}
  