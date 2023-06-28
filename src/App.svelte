<script>
  import { onMount } from "svelte";
  import Time from "svelte-time";
  let dapps = [];
  let defaultDapps = [];
  let searchTerm = "";
  let searchInput;

  onMount(async function () {
    // Default to searching.
    searchInput.focus();
    // Load dapps from the main thread.
    dapps = electron.store.get("dapps");
    // Sort dapp interfaces by the highest version.
    dapps.forEach((d, i) => {
      dapps[i].versions = Object.keys(d.versions)
        .reverse()
        .map((key) => {
          return { ...d.versions[key], id: key };
        });
    });

    // Checkpoint unfiltered dapps list.
    defaultDapps = dapps;
    document.body.scrollIntoView();
  });

  function onKeyDown(e) {
    // Focus search input when "/" is pressed.
		 if (e.keyCode === 191) {
      searchInput.focus();
      searchTerm = "";
     }
	}

  function onSearch(e) {
    dapps = defaultDapps;
    // / is a quick way to empty the search box.
    if (e.target.value.includes('/')) {
      searchTerm = "";
      return;

    }
    if (searchTerm === "") {
      return;
    }
    const regexp = new RegExp(searchTerm, "i");
    dapps = dapps.filter((d) => regexp.test(d.name));
  }

  function onVersionSelect(e) {
    const [domain, version] = e.target.value.split("|");
    const installed = electron.store.get("installed") || {};
    // Map the domain to the chosen UI version.
    installed[domain] = version;
    electron.store.set("installed", installed);
  }
</script>

<main id="main">
  <section class="bg-gray-900">
    <div class="mx-auto max-w-screen-xl px-6">
      <div class="mx-auto draggable max-w-screen-sm">
        <img
          alt="Moar Logo"
          class="mx-auto my-8 inline text-lg align-text-bottom z-10 relative"
          style="width: 50px"
          src="./logo.png"
        />
      </div>
      <div class="container mx-auto px-4 pb-8" on:keydown={onKeyDown}>
        <div id="search" class="mb-2 relative shadow-md bg-gray-800 rounded-lg">
          <div
            class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4"
          >
            <!-- TODO: When we bring filters back, put search back to half width -->
            <!-- <div class="w-full md:w-1/2"> -->
            <form
              class="w-full"
              on:submit|preventDefault={() =>
                window.open(`http://${dapps[0].domain}`, "_blank")}
            >
              <span class="flex items-center">
                <label for="simple-search" class="sr-only">Search</label>
                <div class="relative w-full">
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewbox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    bind:this={searchInput}
                    bind:value={searchTerm}
                    on:keyup={onSearch}
                    type="text"
                    id="simple-search"
                    class="block w-full p-2 pl-10 text-sm border-none rounded-lg bg-gray-50 focus:border-transparent focus:ring-0 bg-gray-700 placeholder-gray-400 text-white"
                    placeholder="Search"
                    required=""
                  />
                </div>
              </span>
            </form>
          </div>
        </div>
        <div class="flex flex-wrap -mx-4">
          {#each dapps as dapp}
            {#if !dapp.hidden}
              <!-- Column -->
              <div id="dapp" class="w-full md:w-1/2 my-4 px-4 lg:w-1/3 not-draggable">
                <!-- Dapp -->
                <a target="_blank" href={`http://${dapp.domain}`}>
                  <article
                    class="bg-gray-800 overflow-hidden rounded-lg shadow-lg"
                  >
                    <img
                      alt="Screenshot"
                      class="block h-auto w-full"
                      src="http://127.0.0.1:8080/ipfs/{dapp.preview}/"
                    />
                    <header
                      class="flex items-center justify-between leading-tight p-2 md:p-4"
                    >
                      <h1 class="text-lg">
                        <span
                          class="text-white no-underline hover:underline text-black"
                        >
                          {dapp.name}
                        </span>
                      </h1>
                      <p class="text-gray-400 text-sm">
                        Updated <Time
                          timestamp={dapp.versions[0].date}
                          live
                          relative
                        />
                      </p>
                    </header>

                    <footer
                      class="flex items-center justify-between leading-none p-2 md:p-4"
                    >
                      <span class="text-gray-400">
                        {dapp.tags[0]}
                      </span>
                      <span class="text-sm">
                        <select
                          on:click|preventDefault
                          tabindex="-1"
                          class="bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                          on:change={onVersionSelect}
                        >
                          {#each dapp.versions as version}
                            <option value={`${dapp.domain}|${version.cid}`}>
                              v{version.id}
                            </option>
                          {/each}
                        </select>
                      </span>
                    </footer>
                  </article>
                </a>
                <!-- END Dapp -->
              </div>
              <!-- END Column -->
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    max-width: none;
  }

  input {
    outline: none;
  }
</style>
