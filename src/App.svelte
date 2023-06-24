<script>
    import { onMount } from "svelte";
    import Time from "svelte-time";
    let dapps = [];

    onMount(async function () {
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
    });

    function onVersionSelect(e) {
        const [domain, version] = e.target.value.split("|");
        const installed = electron.store.get("installed") || {};
        // Map the domain to the chosen UI version.
        installed[domain] = version;
        electron.store.set("installed", installed);
    }
</script>

<main>
    <section class="bg-gray-900">
        <div class="px-4 mx-auto max-w-screen-xl lg:px-6">
            <div class="mx-auto draggable max-w-screen-sm">
                <img
                    alt="Moar Logo"
                    class="mx-auto my-8 inline text-lg align-text-bottom"
                    style="width: 50px"
                    src="./logo.png"
                />
            </div>
            <div class="container mx-auto px-4 pb-8">
                <div class="flex flex-wrap -mx-1 lg:-mx-4">
                    {#each dapps as dapp, index}
                        <!-- Column -->
                        <div
                            class="w-full md:w-1/2 my-4 px-4 lg:w-1/3 not-draggable"
                        >
                            <!-- Article -->
                            <article
                                class="bg-gray-800 overflow-hidden rounded-lg shadow-lg"
                            >
                                <a target="_blank" href={`http://${dapp.domain}`}>
                                    <img
                                        alt="Screenshot"
                                        class="block h-auto w-full"
                                        src="http://127.0.0.1:8080/ipfs/{dapp.preview}/"
                                    />
                                </a>

                                <header
                                    class="flex items-center justify-between leading-tight p-2 md:p-4"
                                >
                                    <h1 class="text-lg">
                                        <a
                                            target="_blank"
                                            class="text-white no-underline hover:underline text-black"
                                            href={`http://${dapp.domain}`}
                                        >
                                            {dapp.name}
                                        </a>
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
                                            class="bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                                            on:change={onVersionSelect}
                                        >
                                            {#each dapp.versions as version}
                                                <option
                                                    value={`${dapp.domain}|${version.cid}`}
                                                >
                                                    v{version.id}
                                                </option>
                                            {/each}
                                        </select>
                                    </span>
                                </footer>
                            </article>
                            <!-- END Article -->
                        </div>
                        <!-- END Column -->
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
</style>
