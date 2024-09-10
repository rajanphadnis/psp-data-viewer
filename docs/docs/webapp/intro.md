---
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Intro

Inspired by a weird combination of Borg and Telemetron.

Access the Webapp here: [https://psp.rajanphadnis.com](https://psp.rajanphadnis.com)

And the Admin console here: [https://psp-admin.rajanphadnis.com](https://psp-admin.rajanphadnis.com)

data is shown in your local timezone, but stored in the database in UTC time

## Feature Roadmap

Progress is made whenever I'm bored, but here are the features want to implement:

Want to request a new feature? Fill out a ticket [here](https://github.com/rajanphadnis/psp-data-viewer/issues/new/choose)

#### Calc Channels

- [ ] Expose moving window settings and variable blacklisting
- [ ] Expose custom formula API
- [ ] Add variable checking

#### Data Export Wizard

- [ ] Dropdown on CSV button to launch wizard (HF = High Fidelity Data, AG = Aggregated Data):

|                | All-time | Shown-time |
| :------------: | :------: | :--------: |
|  All Channels  |    HF    |     HF     |
| Shown Channels |    HF    |   HF, AG   |

#### Plotting

- [ ] Data annotations (already in the API!)
- [ ] [Maybe] More intuitive zoom/pan options
- [ ] Option to disable axis for certain channels (`bin`, for example)
- [ ] Add button to legend to display currently displayed time period 
  - click to toggle between human-readable and api-compatible unix epoch timestamps
- [ ] Show more decimal points in displayed time in legend during hover

#### Accessibility

- [ ] Popup to provide code samples to access data that is currently visible
- [ ] Guided tour

#### Documentation

- [ ] Comment the code
- [ ] Write `Backend` docs
- [ ] Fill out `Webapp` docs

#### Settings/Other

- [ ] Export calc channels and settings as JSON
  - [ ] Import settings
- [ ] Look into using pointer clicks as measuring tool points instead of keyboard
- [ ] Add slope measurement to measuring tool
- [ ] State diagram on P&ID
