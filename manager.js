const tabs = await chrome.tabs.query({});
const selected = [];
const groups = await chrome.tabGroups.query({});

tabs.sort((a, b) => a.index - b.index);

const template = document.getElementById("popup");
const elements = [];
for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);
    const title = tab.title;
    const pathname = new URL(tab.url);

    element.querySelector(".title").textContent = title;
    element.querySelector(".url").textContent = pathname;
    if (tab.groupId > -1) {
        const groupColor = await chrome.tabGroups.get(tab.groupId);
        element.classList.add(groupColor.color);
    }

    //selecting pages
    element.querySelector("a").addEventListener("click", async () => {

        if (selected.includes(tab)) {
            if (tab.groupId > -1) {
                const group = tab.groupId;
                for (const i of tabs) {
                    if (i.groupId == group) {
                        const index = selected.indexOf(i);
                        selected.splice(index, 1);
                        const tabIndex = tabs.indexOf(i);
                        elements[tabIndex].classList.remove("selected");
                    }
                }
            }
            else {
                const index = selected.indexOf(tab);
                if (index > -1) {
                    selected.splice(index, 1);
                    element.classList.remove("selected");
                }

            }
        }
        else {
            if (tab.groupId > -1) {
                const group = tab.groupId;
                for (const i of tabs) {
                    if (i.groupId == group) {
                        selected.push(i);
                        const tabIndex = tabs.indexOf(i);
                        elements[tabIndex].classList.add("selected");
                    }
                }
            }
            else {
                selected.push(tab);
                element.classList.add("selected");
            }

        }
    })

    /////// changing tab focus
    element.querySelector("a").addEventListener("dblclick", async () => {
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    })

    /////// closing tabs
    element.querySelector("a").addEventListener("contextmenu", async (event) => {
        event.preventDefault();
        chrome.tabs.remove(tab.id);
        window.location.reload();
    })

    /////// create group
<<<<<<< HEAD
    const groupB = document.querySelector(".group");
    groupB.addEventListener("click", async () => {
    const tabIds = selected.map(({ id }) => id);
    console.log(tabIds);
    const group = await chrome.tabs.group({ tabIds });

    window.location.reload();
    });

    /////// delete group
    const ungroupB = document.querySelector(".ungroup");
    ungroupB.addEventListener("click", async () => {
        const tabIds = selected.map(({ id }) => id);
        console.log(tabIds);
        const group = await chrome.tabs.ungroup(tabIds);

    window.location.reload();
    });
  
elements.push(element);
=======
    const button = document.querySelector(".group");
    button.addEventListener("click", async () => {
        const tabIds = selected.map(({ id }) => id);
        const group = await chrome.tabs.group({ tabIds });

        for (const tab of tabs) {
            const index = selected.indexOf(tab);
            selected[index].classList.add('grouped');
        }
    });

    // /////// find keyword in selected tabs
    // const findButton = document.querySelector(".find");
    // findButton.addEventListener("click", async () => {
    //     const tabIds = selected.map(({ id }) => id);
    //     // const group = await chrome.tabs.group({ tabIds });

    //     for (const tab of tabs) {
    //         const index = selected.indexOf(tab);
    //         selected[index].classList.add('grouped');
    //     }
    // });

>>>>>>> 54971107f879d027c72c228c30fc5416bffade40
}

reloadList(document.querySelector("ul"));

function reloadList(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    element.append(...elements);
}
