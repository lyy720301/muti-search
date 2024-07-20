// Initialize default API suggestions
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      keySuggestions: []
    });
  }
});
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: '请输入搜索关键字'
  });
  const { keySuggestions } = await chrome.storage.local.get('keySuggestions');
  const suggestions = keySuggestions.map((key) => {
    return { content: key, description: key };
  });
  suggest(suggestions);
});

// Open the reference page of the chosen API
chrome.omnibox.onInputEntered.addListener((input) => {
  new Promise(() => chrome.tabs.create({ url: "https://baidu.com/s?wd=" + input }));
  new Promise(() => chrome.tabs.create({ url: "https://google.com/search?q=" + input }));
  new Promise(() => chrome.tabs.create({ url: "https://bing.com/search?q=" + input }));
  new Promise(() => chrome.tabs.create({ url: "https://sogou.com/web?query=" + input }));
  // Save the latest keyword
  updateHistory(input);
});

async function updateHistory(input) {
  const { keySuggestions } = await chrome.storage.local.get('keySuggestions');
  if (!keySuggestions) {
    keySuggestions = [];
  }
  keySuggestions.unshift(input);
  keySuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
  return chrome.storage.local.set({ keySuggestions });
}
