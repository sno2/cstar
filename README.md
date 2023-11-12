# Swan Hacks 2023 Hackathon Project

Team members: Jacob Duba, Carter Snook, and Thomas Daniels

## Initial Steps

Assumes we know the direction that we are pointing in.

1. Camera view visible
2. Align camera dot with the horizon
3. Tap the screen
4. Move camera view upwards to Polaris
5. Tap the screen

> Note: Now we have the latitude angle.

6. Consider the declination for Polaris
7. Account for time and date in LST
8. Consider a star chart or data set to obtain location

## Progression

Our idea is to have a digital sextant that is able to give the user their
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

$$

sunrise\ =\ 720-4\left(longitude+ha\right)-eqtime

\\\\

sunrise=720-4\cdot longitude-4\cdot ha-eqtime

\\\\

4\cdot longitude=720-4\cdot ha-eqtime-sunrise

\\\\

longitude=\frac{720-eqtime-sunrise}{4}-ha

\\\\

longitude=\frac{720-eqtime-sunrise}{4}-\left(\frac{tst}{4}-180\right)

\\\\

longitude=\frac{720-eqtime-sunrise}{4}-\frac{hr\cdot60+mn+\frac{sc}{60}}{4}-\frac{to}{4}+180

\\\\

to=eqtime+4\cdot longitude-60\cdot timezone

\\\\

longitude=\frac{720-eqtime-sunrise}{4}-\frac{hr\cdot60+mn+\frac{sc}{60}}{4}-\frac{eqtime+4\cdot
longitude-60\cdot timezone}{4}+180

\\\\

longitude=\frac{720-eqtime-sunrise}{4}-\frac{hr\cdot60+mn+\frac{sc}{60}}{4}-\frac{eqtime+4\cdot
longitude-60\cdot timezone}{4}+180

\\\\

longitude=\frac{720-eqtime-sunrise}{4}-\frac{hr\cdot60+mn+\frac{sc}{60}}{4}-longitude-\frac{eqtime-60\cdot
timezone}{4}+180

\\\\

2\cdot
longitude=\frac{720-eqtime-sunrise}{4}-\frac{hr\cdot60+mn+\frac{sc}{60}}{4}\frac{eqtime-60\cdot
timezone}{4}+180

$$
