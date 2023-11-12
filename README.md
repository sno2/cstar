<img src="./public/images/CSTAR-transparent.png" width="200" alt="Logo">

# CSTAR: Swan Hacks 2023 Hackathon Project

Team members: Jacob Duba, Carter Snook, and Thomas Daniels

## Progression

Our idea was to create a digital sextant that is able to give the user their
location based solely upon the angle from the horizon and Polaris.

The first attempt to solve the problem was using the
[National Oceanic and
Atmospheric Administration's (NOAA) solar equation formulas](https://gml.noaa.gov/grad/solcalc/solareqns.PDF).

We are able to easily find an estimate for the user's latitude position by
taking the angle between polaris and the horizon. After that, NOAA's equations
describe how to find the solar noon using the longitude, and the sunrise time.
However, we had to derive the practical inverse of this function which required
quite a bit of number juggling:

![Sunrise Derivation](./progression/sunrise-derivation.png)
