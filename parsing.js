const { default: mongoose } = require("mongoose");

function parseUserObject(userObject) {
    if (!userObject) {
        return null;
    }

    if (typeof userObject === "string") {
        return convertToObjectId(userObject);
    }

    let model = null;

    try {
        model = {
            _id: safeObjectId(userObject._id),
            name: userObject.name,
            email: userObject.email,
            password: userObject.password,
            groups: Array.isArray(userObject.groups)
                ? userObject.groups
                      .filter(Boolean)
                      .map(group => safeParse(parseGroupObject, group))
                      .filter(Boolean)
                : [],
            beacons: Array.isArray(userObject.beacons)
                ? userObject.beacons
                      .filter(Boolean)
                      .map(beacon => safeParse(parseBeaconObject, beacon))
                      .filter(Boolean)
                : [],
            location: parseLocationObject(userObject.location),
            createdAt: convertToDate(userObject.createdAt),
            updatedAt: convertToDate(userObject.updatedAt),
            __v: userObject.__v,
        };
    } catch (error) {
        return null;
    }

    return model;
}

function parseBeaconObject(beaconObject) {
    if (!beaconObject) {
        return null;
    }

    if (typeof beaconObject === "string") {
        return convertToObjectId(beaconObject);
    }

    const model = {
        _id: safeObjectId(beaconObject._id),
        title: beaconObject.title,
        shortcode: beaconObject.shortcode,
        startsAt: convertToDate(beaconObject.startsAt),
        expiresAt: convertToDate(beaconObject.expiresAt),
        group: safeParse(parseGroupObject, beaconObject.group),
        leader: safeParse(parseUserObject, beaconObject.leader),
        location: parseLocationObject(beaconObject.location),
        followers: Array.isArray(beaconObject.followers)
            ? beaconObject.followers
                  .filter(Boolean)
                  .map(follower => safeParse(parseUserObject, follower))
                  .filter(Boolean)
            : [],
        landmarks: Array.isArray(beaconObject.landmarks)
            ? beaconObject.landmarks
                  .filter(Boolean)
                  .map(landmark => safeParse(parseLandmarkObject, landmark))
                  .filter(Boolean)
            : [],
        route: Array.isArray(beaconObject.route) ? beaconObject.route.filter(Boolean).map(parseLocationObject) : [],
        geofence: beaconObject.geofence,
        updatedAt: convertToDate(beaconObject.updatedAt),
        __v: beaconObject.__v,
    };

    return model;
}

function parseGroupObject(groupObject) {
    if (!groupObject) {
        return null;
    }

    if (typeof groupObject === "string") {
        return convertToObjectId(groupObject);
    }

    const model = {
        _id: safeObjectId(groupObject._id),
        title: groupObject.title,
        shortcode: groupObject.shortcode,
        createdAt: convertToDate(groupObject.createdAt),
        updatedAt: convertToDate(groupObject.updatedAt), // ← FIXED TYPO
        leader: safeParse(parseUserObject, groupObject.leader),
        members: Array.isArray(groupObject.members)
            ? groupObject.members
                  .filter(Boolean)
                  .map(member => safeParse(parseUserObject, member))
                  .filter(Boolean)
            : [],
        beacons: Array.isArray(groupObject.beacons)
            ? groupObject.beacons
                  .filter(Boolean)
                  .map(beacon => safeParse(parseBeaconObject, beacon))
                  .filter(Boolean)
            : [],
        __v: groupObject.__v,
    };

    return model;
}

function parseLandmarkObject(landmarkObject) {
    if (!landmarkObject) {
        return null;
    }

    if (typeof landmarkObject === "string") {
        return convertToObjectId(landmarkObject);
    }

    const model = {
        _id: safeObjectId(landmarkObject._id),
        title: landmarkObject.title,
        location: parseLocationObject(landmarkObject.location),
        createdBy: safeParse(parseUserObject, landmarkObject.createdBy),
        createdAt: convertToDate(landmarkObject.createdAt),
        updatedAt: convertToDate(landmarkObject.updatedAt),
        __v: landmarkObject.__v,
    };

    return model;
}

function parseLocationObject(locationObject) {
    if (!locationObject) return undefined;

    return {
        lat: locationObject.lat,
        lon: locationObject.lon,
    };
}

function convertToObjectId(id) {
    return new mongoose.Types.ObjectId(id);
}

function safeObjectId(id) {
    if (!id) return null;
    return convertToObjectId(id);
}

function convertToDate(date) {
    if (!date) return null;
    return new Date(date);
}

function safeParse(fn, obj) {
    if (!obj) return null;
    try {
        return fn(obj);
    } catch (err) {
        return null;
    }
}

module.exports = {
    parseUserObject,
    parseBeaconObject,
    parseLandmarkObject,
    parseLocationObject,
    parseGroupObject,
    convertToObjectId,
    convertToDate,
};
