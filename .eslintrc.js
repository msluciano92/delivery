module.exports = {
    "globals": {
        "sails": true,
    },
    "extends": "airbnb-base",
    "rules": {
        "indent": [ "warn", 4 ],
        "no-undef": 0,
        "max-len": [ "warn", 180 ] ,
        "func-names": ["error", "never"],
        "no-shadow": "off",
        "no-await-in-loop": "off"
    },
};
