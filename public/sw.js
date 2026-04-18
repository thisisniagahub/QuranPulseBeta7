/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-e67eb281'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "index.html",
    "revision": "b0a175abe83a8b0ab6dc122904d6d574"
  }, {
    "url": "favicon.ico",
    "revision": "c30c7d42707a47a3f4591831641e50dc"
  }, {
    "url": "assets/xychartDiagram-PRI3JC2R-CP7npabO.js",
    "revision": null
  }, {
    "url": "assets/vendor-supabase-DFvHDW3n.js",
    "revision": null
  }, {
    "url": "assets/vendor-react-gYmC4awA.js",
    "revision": null
  }, {
    "url": "assets/vendor-pdf-CmvDAIpj.js",
    "revision": null
  }, {
    "url": "assets/vendor-motion-CQStspVU.js",
    "revision": null
  }, {
    "url": "assets/vendor-mermaid-VLi03pT9.js",
    "revision": null
  }, {
    "url": "assets/vendor-lottie-Byq20xDu.js",
    "revision": null
  }, {
    "url": "assets/vendor-icons-BuQPjcYO.js",
    "revision": null
  }, {
    "url": "assets/useQibla-CPpvNCOc.js",
    "revision": null
  }, {
    "url": "assets/treemap-KMMF4GRG-DqcTr8tj.js",
    "revision": null
  }, {
    "url": "assets/timeline-definition-IT6M3QCI-DQAuI1d0.js",
    "revision": null
  }, {
    "url": "assets/stateDiagram-v2-4FDKWEC3-DCwrNgp2.js",
    "revision": null
  }, {
    "url": "assets/stateDiagram-FKZM4ZOC-Do6vhDQN.js",
    "revision": null
  }, {
    "url": "assets/sequenceDiagram-WL72ISMW-D5ENccw9.js",
    "revision": null
  }, {
    "url": "assets/sankeyDiagram-TZEHDZUN-DgD8z5j6.js",
    "revision": null
  }, {
    "url": "assets/requirementDiagram-UZGBJVZJ-0K3RSMFq.js",
    "revision": null
  }, {
    "url": "assets/quadrantDiagram-AYHSOK5B-BmDzrdfj.js",
    "revision": null
  }, {
    "url": "assets/pieDiagram-ADFJNKIX-W2istFAw.js",
    "revision": null
  }, {
    "url": "assets/paymentService-CI7DTonJ.js",
    "revision": null
  }, {
    "url": "assets/mindmap-definition-VGOIOE7T-MI5znipD.js",
    "revision": null
  }, {
    "url": "assets/min-DyDInOG6.js",
    "revision": null
  }, {
    "url": "assets/layout-Dna0cWYN.js",
    "revision": null
  }, {
    "url": "assets/katex-CtI-vZzQ.js",
    "revision": null
  }, {
    "url": "assets/kanban-definition-3W4ZIXB7-Cy_HZLT_.js",
    "revision": null
  }, {
    "url": "assets/journeyDiagram-XKPGCS4Q-DiDBdnYN.js",
    "revision": null
  }, {
    "url": "assets/infoDiagram-WHAUD3N6-v0rBIKZi.js",
    "revision": null
  }, {
    "url": "assets/index-DqecCbJw.js",
    "revision": null
  }, {
    "url": "assets/index-D1NF-mgE.js",
    "revision": null
  }, {
    "url": "assets/index-CWdQH_Yh.css",
    "revision": null
  }, {
    "url": "assets/index-CMtDOzkz.js",
    "revision": null
  }, {
    "url": "assets/index-CKC_o5TW.js",
    "revision": null
  }, {
    "url": "assets/index-BahO9xD8.js",
    "revision": null
  }, {
    "url": "assets/index-B5O5kXxv.js",
    "revision": null
  }, {
    "url": "assets/graph-zOSH0YDJ.js",
    "revision": null
  }, {
    "url": "assets/gitGraphDiagram-NY62KEGX-DtdMdB2e.js",
    "revision": null
  }, {
    "url": "assets/ganttDiagram-JELNMOA3-fmmjdGFj.js",
    "revision": null
  }, {
    "url": "assets/flowDiagram-NV44I4VS-CTFvW_wK.js",
    "revision": null
  }, {
    "url": "assets/erDiagram-Q2GNP2WA-CZFxdZSo.js",
    "revision": null
  }, {
    "url": "assets/diagram-S2PKOQOG-CJpaKCdY.js",
    "revision": null
  }, {
    "url": "assets/diagram-QEK2KX5R-ghNAvnz3.js",
    "revision": null
  }, {
    "url": "assets/diagram-PSM6KHXK-DmeFc2Th.js",
    "revision": null
  }, {
    "url": "assets/dagre-6UL2VRFP-DO_VHM0I.js",
    "revision": null
  }, {
    "url": "assets/cytoscape.esm-3uhDE42e.js",
    "revision": null
  }, {
    "url": "assets/cose-bilkent-S5V4N54A-BDyFqxl-.js",
    "revision": null
  }, {
    "url": "assets/confetti.module-DWkI11Ge.js",
    "revision": null
  }, {
    "url": "assets/clone-IeRaqoQE.js",
    "revision": null
  }, {
    "url": "assets/classDiagram-v2-WZHVMYZB-B5lAMAMm.js",
    "revision": null
  }, {
    "url": "assets/classDiagram-2ON5EDUG-B5lAMAMm.js",
    "revision": null
  }, {
    "url": "assets/chunk-TZMSLE5B-DqmWpFuM.js",
    "revision": null
  }, {
    "url": "assets/chunk-QZHKN3VN-DszkoyCu.js",
    "revision": null
  }, {
    "url": "assets/chunk-QN33PNHL-C6ekmKY6.js",
    "revision": null
  }, {
    "url": "assets/chunk-FMBD7UC4-COp-VFGZ.js",
    "revision": null
  }, {
    "url": "assets/chunk-DI55MBZ5-CmVbXm4z.js",
    "revision": null
  }, {
    "url": "assets/chunk-B4BG7PRW-Dr5_-uE6.js",
    "revision": null
  }, {
    "url": "assets/chunk-55IACEB6-CvioOzXq.js",
    "revision": null
  }, {
    "url": "assets/chunk-4BX2VUAB-DWNeBqiF.js",
    "revision": null
  }, {
    "url": "assets/c4Diagram-YG6GDRKO-B6rBpCEG.js",
    "revision": null
  }, {
    "url": "assets/blockDiagram-VD42YOAC-BZR9nx_3.js",
    "revision": null
  }, {
    "url": "assets/architectureDiagram-VXUJARFQ-BbynM1M5.js",
    "revision": null
  }, {
    "url": "assets/analyticsService-DSAlL85X.js",
    "revision": null
  }, {
    "url": "assets/aiService-13XARhH4.js",
    "revision": null
  }, {
    "url": "assets/_baseUniq-C9aEvWto.js",
    "revision": null
  }, {
    "url": "assets/ZakatCalculator-CKMfwKY6.js",
    "revision": null
  }, {
    "url": "assets/WhatsAppProactiveSection-WOTzQPeZ.js",
    "revision": null
  }, {
    "url": "assets/VoiceActiveReader-ChLhD43c.js",
    "revision": null
  }, {
    "url": "assets/VerseStudio-DuSJRn6K.js",
    "revision": null
  }, {
    "url": "assets/VerseNotesModal-CgTEMw4v.js",
    "revision": null
  }, {
    "url": "assets/UstazahOrchestrator-ygOfHIaS.js",
    "revision": null
  }, {
    "url": "assets/ThemeSettingsModal-pFwn5Kmc.js",
    "revision": null
  }, {
    "url": "assets/TermsOfService-kkOKy-F1.js",
    "revision": null
  }, {
    "url": "assets/TafsirPanel-BJ-Dvzfn.js",
    "revision": null
  }, {
    "url": "assets/SurahQuest-aMY2CiJX.js",
    "revision": null
  }, {
    "url": "assets/SurahInfoPanel-ddXB3F7h.js",
    "revision": null
  }, {
    "url": "assets/SubscriptionPage-Tl1RlyCs.js",
    "revision": null
  }, {
    "url": "assets/Souq-4pPDHjk2.js",
    "revision": null
  }, {
    "url": "assets/SmartDeenCrossover-Dg2uZvGR.js",
    "revision": null
  }, {
    "url": "assets/SmartDeen-VNvw-820.js",
    "revision": null
  }, {
    "url": "assets/RefundPolicy-DpopG52K.js",
    "revision": null
  }, {
    "url": "assets/ReadingGoalsModal-Bee9vj2D.js",
    "revision": null
  }, {
    "url": "assets/RangeRepeatModal-C8wkF1-s.js",
    "revision": null
  }, {
    "url": "assets/QwerDemoSection-9BdTwr8_.js",
    "revision": null
  }, {
    "url": "assets/QuranReader-DanLK3p8.js",
    "revision": null
  }, {
    "url": "assets/QuranDisplaySettings-BpPRWCD8.js",
    "revision": null
  }, {
    "url": "assets/Profile-BRwK0meH.js",
    "revision": null
  }, {
    "url": "assets/PrivacyPolicy-giNhhTC5.js",
    "revision": null
  }, {
    "url": "assets/PricingTable-CyVSSFBJ.js",
    "revision": null
  }, {
    "url": "assets/PremiumTestimonials-BBCc2jHs.js",
    "revision": null
  }, {
    "url": "assets/PainTransformation-wwMHU_Xl.js",
    "revision": null
  }, {
    "url": "assets/OpenClawShowcase-D4LQJOaf.js",
    "revision": null
  }, {
    "url": "assets/MushafView-CVRphJqu.js",
    "revision": null
  }, {
    "url": "assets/MediaStudio-ConL3yOI.js",
    "revision": null
  }, {
    "url": "assets/Leaderboard-2gpsJb1o.js",
    "revision": null
  }, {
    "url": "assets/LandingPage-DDESG4Lt.js",
    "revision": null
  }, {
    "url": "assets/KhatamProgressTracker-C_dpY4Ip.js",
    "revision": null
  }, {
    "url": "assets/KhatamPlanner-fUxvzddc.js",
    "revision": null
  }, {
    "url": "assets/KafaDashboard-DxWQ42Pq.js",
    "revision": null
  }, {
    "url": "assets/IqraGraduation-BBOVm-1F.js",
    "revision": null
  }, {
    "url": "assets/IqraGameEngine-x1O7VhrA.js",
    "revision": null
  }, {
    "url": "assets/IqraDigitalReader-DJRXchxo.js",
    "revision": null
  }, {
    "url": "assets/InfaqPage-DJFXMkFY.js",
    "revision": null
  }, {
    "url": "assets/Ibadah-peXhvPVX.js",
    "revision": null
  }, {
    "url": "assets/HafazanMode-B8ZqE1KS.js",
    "revision": null
  }, {
    "url": "assets/GuideViewer-BwL-AnNQ.js",
    "revision": null
  }, {
    "url": "assets/GoToVerseModal-CdgPRtQ2.js",
    "revision": null
  }, {
    "url": "assets/GlowFooter-Je03pIYE.js",
    "revision": null
  }, {
    "url": "assets/FinalCta-8B21lY97.js",
    "revision": null
  }, {
    "url": "assets/FeatureShowcase-Bg3XXvkv.js",
    "revision": null
  }, {
    "url": "assets/FAQSection-DhM5_q38.js",
    "revision": null
  }, {
    "url": "assets/DailyAyatWidget-DKdJ91F4.js",
    "revision": null
  }, {
    "url": "assets/ComparisonSection-BjDKcdeq.js",
    "revision": null
  }, {
    "url": "assets/BookmarkCollectionsModal-BpL0dJfW.js",
    "revision": null
  }, {
    "url": "assets/AdminDashboard-CcF4zArL.js",
    "revision": null
  }, {
    "url": "assets/AIAgentShowcase-D3w2cfxe.js",
    "revision": null
  }, {
    "url": "assets/patterns/cyber-islamic-grid.svg",
    "revision": null
  }, {
    "url": "UstazAI-Icon.png",
    "revision": "251745000153a0e3da24d8d25fd139c2"
  }, {
    "url": "favicon.ico",
    "revision": "c30c7d42707a47a3f4591831641e50dc"
  }, {
    "url": "logo-full.png",
    "revision": "d24172befc4dd2fa7051afcbf9ff3f00"
  }, {
    "url": "icons/icon-192x192.png",
    "revision": "c77ba968f159b6cf7c93052446900f5c"
  }, {
    "url": "icons/icon-512x512.png",
    "revision": "8b20dc77ad42caf14bf9aa1ed9dd005c"
  }, {
    "url": "icons/icon-maskable-512x512.png",
    "revision": "50faae98d90d455a6f3c7c5adfe90daa"
  }, {
    "url": "manifest.webmanifest",
    "revision": "145cd600fa7eb11b2e0cefae829bc94f"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    denylist: [/^\/api/, /\.[a-z]+$/]
  }));
  workbox.registerRoute(/^https:\/\/api\.quran\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "quran-api-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 500,
      maxAgeSeconds: 604800
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/verses\.quran\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "quran-audio-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 2592000
    })]
  }), 'GET');
  workbox.registerRoute(({
    request
  }) => request.destination === "image", new workbox.CacheFirst({
    "cacheName": "images",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 2592000
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/images\.unsplash\.com\/.*/i, new workbox.StaleWhileRevalidate({
    "cacheName": "unsplash-images",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 2592000
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/grainy-gradients\.vercel\.app\/.*/i, new workbox.StaleWhileRevalidate({
    "cacheName": "grainy-gradients",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 2592000
    })]
  }), 'GET');
  workbox.registerRoute(({
    request
  }) => request.destination === "video" || request.destination === "audio", new workbox.NetworkOnly(), 'GET');

}));
