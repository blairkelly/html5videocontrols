html5videocontrols
==================

This script is intended to replace HTML5 video controls on iPad. It is still far from complete.

A big issue: in order for the events to fire properly on the iPad, the video element must have a display of none and the play event appears to have to come from a user's touch. The weird stuff you see in the script is a result of that. (Keeping the video hidden, adding a new source, then playing... etc). Hopefully this can be resolved in the future. Probably the first thing to happen will be that I will provide some sort of flag or detection of iOS and it's various versions to give different behaviour on different platforms...

Pass the main function, vidcontrols, a target video element. The video element will be wrapped and the controls will be dropped in with that wrapper.


NOTES:

-PRESENTLY SUPPORTING ONLY iPad (2nd gen and higher) and CHROME.

-PRESENTLY, DISPLAY DELAY ONLY WORKS IN SECONDS.



Dependencies: jQuery