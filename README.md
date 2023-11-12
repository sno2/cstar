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

## Q/A

###  What values are factored in? 

The solar noon and UTC time are used to determine the longitude, or the ring wrapped around the earth that is perpendicular to the north and south poles. The polar angle is used to determine the Latitude, which is the line that is parallel to the poles. 

### How precise do you need to be?

If you are accurate to a whole number with the polar angle, you will be within 60 miles. Being accurate to one decimal place lowers this to 10 miles. For the solar noon, it is important to be within one minute exactly. To do this, use the level in your phone, or an analog one to verify a perfect level, so you can be absolutely sure of the precision, otherwise you can see variance upwards of 150 or so miles. 

### Why do we use solar noon instead of solar sunrise?

Solar noon minimizes refraction, while solar sunrise can raise the unpredictability by at least 3 degrees, which is equivalent to 183 miles. 

### What is the point of this instead of GPS? 

Along with the fact that not every person can have access to GPS, Some people need to use an alternative to this. An example of this are anti-poachers, who need to avoid emitting signals, such as the radio ones used by GPS, to avoid giving themselves away.

