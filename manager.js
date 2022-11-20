import { Finder } from "./finder.js";


const tabs = await chrome.tabs.query({});
const selected = [];
const groups = await chrome.tabGroups.query({});
const names=[];
const myfinder= new Finder();
tabs.sort((a, b) => a.index - b.index);

const template = document.getElementById("popup");
const elements = [];
for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);
    const title = tab.title;
    const pathname = new URL(tab.url);

    names.push(tab.url);

    element.querySelector(".title").textContent = title;
    element.querySelector(".url").textContent = pathname;
    if (tab.groupId > -1) {
        const groupColor = await chrome.tabGroups.get(tab.groupId);
        element.classList.add(groupColor.color);
        element.classList.add("grouped")
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

    element.querySelector('button').addEventListener('click', async () => {
        chrome.tabs.remove(tab.id);
        window.location.reload();
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
    const groupB = document.querySelector(".group");
    groupB.addEventListener("click", async () => {
        const tabIds = selected.map(({ id }) => id);
        const group = await chrome.tabs.group({ tabIds });

        window.location.reload();
    });


    /////// delete group
    const ungroupB = document.querySelector(".ungroup");
    ungroupB.addEventListener("click", async () => {
        const tabIds = selected.map(({ id }) => id);
        const group = await chrome.tabs.ungroup(tabIds);

        window.location.reload();
    });


    /////// search tab with keyword
    const findButton = document.querySelector(".search");
    findButton.addEventListener("click", async () => {
        var searchInput = document.getElementById("searchBar").value;

        const popups = document.getElementsByTagName('li');
        for (const popup of popups) {
            if(searchInput === "") popup.classList.remove("searchFound");
            else if(popup.innerText.indexOf(searchInput) > -1) {
                if(!popup.classList.contains("searchFound")){
                    popup.classList.add("searchFound");
                }
                
            }
        }
    });


    elements.push(element);

    
    const b=myfinder.checkIfDuplicateExists(names);

    if(b){ 
        const dupl=myfinder.findDupl(names);    
        document.getElementById("copy").innerHTML="There are repeated urls, use the search function to find them";
    }




};

reloadList(document.querySelector("ul"));


function reloadList(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    element.append(...elements);
}
