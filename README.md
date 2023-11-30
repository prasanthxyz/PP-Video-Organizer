# P-Video-Organizer

A video organizer and random video selector with genre/gallery tagging and slideshows.

## Setup instructions

1. Go to "Videos" tab and add all required video files
2. Go to "Galleries" tab and add all required directories - folders with images to slideshow<br/>
   Feel free to add a dummy directory if this feature is not required
3. Go to "Tags" tab and add required tags (optional)
4. Go to "Videos" tab again, open each video and customize the relations from "Associations" tab

## Usage

1. Go to "Random" tab to see the random choice in "Watch" section
2. Use "Config" section to set required filters (i.e. galleries/tags/videos to select from)<br/>
   **NOTE:** When multiple galleries are selected, videos associated with "any/at-least-one" of the selected galleries will be used to pick from.<br/>
   Meanwhile, when multiple tags are selected, only those videos associated with "**all of**" selected tags will be considered.
   For example, if "thriller" and "horror" tags are selected, the selected videos will be associated with both thriller and horror tags.

## Keyboard Shortcuts

### Global

|           |                      |
| --------- | -------------------- |
| `Shift+r` | Go to Random page    |
| `Shift+v` | Go to Videos page    |
| `Shift+g` | Go to Galleries page |
| `Shift+t` | Go to Tags page      |

### "Random" page

|     |                                                      |
| --- | ---------------------------------------------------- |
| `w` | Go to Watch tab                                      |
| `c` | Go to Config tab                                     |
| `n` | Select Next Combination                              |
| `b` | Select Previous Combination                          |
| `p` | Toggle TGP and Video<br/>(works only in "Watch" tab) |

### Video page

|     |                                                    |
| --- | -------------------------------------------------- |
| `v` | Go to Video tab                                    |
| `t` | Go to TGP tab                                      |
| `a` | Go to Associations tab                             |
| `p` | (Switch to Video tab and) Start/Stop playing video |

### Video Player

|                      |                             |
| -------------------- | --------------------------- |
| `0-9 numerical keys` | Seek video by 10% intervals |
| `Left/Right arrows`  | Seek video by 5 seconds     |
| `Up/Down arrows`     | Increase/decrease volume    |
| `f`                  | Toggle full screen          |
| `m`                  | Toggle mute                 |
