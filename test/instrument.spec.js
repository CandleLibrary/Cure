import URL from "@candlefw/url";
import { getPackageJsonObject as getPackageJSON } from "@candlefw/wax";
import fs from "fs";
import path from "path";
import { instrument, processPackageData } from "../build/library/utilities/instrument.js";

URL.toString();

assert_group("Gets package.json", sequence, () => {

    assert("Loads package.json", (await getPackageJSON()).FOUND == true);
    assert("Loads @candlelib/package.json", (await getPackageJSON()).package.name == "@candlelib/test");
    assert("The directory that package.json is found in should be the same as CWD/PWD", (await getPackageJSON()).package_dir == process.cwd() + "/");
});

assert_group("Processes package.json", sequence, () => {

    "processPackageData throws if the package is not a module: commonjs";
    assert(!processPackageData({ main: "test", type: "commonjs", name: "@candlefw/test" }));

    "processPackageData throws if the package is not a module: no type";
    assert(!processPackageData({ main: "test", name: "@candlefw/test" }));

    "processPackageData does not throw if the package is a module";
    assert(processPackageData({ main: "test", type: "module", name: "@candlefw/test" }, {}));

    "Adds @candlefw/test@latest to devDependencies of package.json";
    const pkg = { main: "test", type: "module", name: "@candlefw/test" };
    const { package: tst_pkg } = await getPackageJSON();
    processPackageData(pkg, tst_pkg);
    assert(pkg.devDependencies["@candlefw/test"] == tst_pkg.version);
});


assert_group(skip, "Create Spec File", sequence, () => {
    "Simulated Test"; "#";

    const
        fsp = fs.promises,
        dir = "./__temp__/",
        build_dir = "./build/library/";

    //Copy data to new location.
    try {
        await fsp.mkdir(dir, { recursive: true });
        await fsp.mkdir(path.join(dir, build_dir), { recursive: true });
        await fsp.copyFile("./package.json", path.join(dir, "package.json"));
        await fsp.copyFile(path.join(build_dir, "test.js"), path.join(dir, build_dir, "test.js"));
    } catch (e) {
        $$h.addException(e);
        /*  Don't really care if this fails. 
            Likely the directory and file 
            already exists */ }

    await instrument(dir, true);

    assert(await fsp.readFile(path.join(dir, "test/candlefw.test.spec.js")));

    assert(await fsp.readFile(path.join(dir, "package.json")));

    const { FOUND, package: data } = await getPackageJSON(URL.resolveRelative(dir, process.cwd() + "/"));

    const { package: main_data } = await getPackageJSON(process.cwd() + "/");

    assert(FOUND == true);

    assert(data.devDependencies["@candlefw/test"] == main_data.version);

    assert(data?.scripts.test == "cfw.test ./test/**");

    assert(data?.scripts["test.watch"] == "cfw.test -w ./test/**");

    assert(await fsp.rmdir(dir, { recursive: true }));
});