import { Frame, NavigationEntry } from "tns-core-modules/ui/frame";
import { Button } from "tns-core-modules/ui/button";
import { getImage } from "../helpers/screenshot";
import { sendDataForImageComparison } from "~/helpers/service-context";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";

describe('Hello World Sample Test:', function () {
	this.timeout(99999999);

	let rootPageLayout = null;

	function setContent(content) {
		rootPageLayout.addChild(content);
	}

	before(() => {
	});

	after(() => {
		console.log("========== finished ==========");
	});

	it('test-button-red', function (done) {
		testButton("red").then(r => done());
		console.log("end of test");
	});

	it('test-button-green', function (done) {
		testButton("green").then(r => done());
		console.log("end of test");
	});

	it('test-main-page', function (done) {
		Frame.topmost().navigate(<NavigationEntry>{
			moduleName: "main-test-page",
		});

		setTimeout(() => {
			const img = getImage(Frame.topmost().currentPage);
			sendDataForImageComparison(`test-main-page`, img)
				.then(result => {
					if (!result) {
						assert.isTrue(result);
						done(`test-main-page`);
					}else {
						done();
					}

				});
		}, 1000);

	});

	const testButton = (color) => {
		(Frame.topmost().currentPage.content as LayoutBase).eachChild(child => {
			if (child.typeName === "GridLayout") {
				console.log(child);
				rootPageLayout = child;
				return true;
			}
			return false;
		});
		return new Promise((resolve, reject) => {
			const button = new Button();
			button.text = color;
			button.backgroundColor = color;
			button.on("layoutChanged", () => {
				setTimeout(() => {
					const img = getImage(Frame.topmost().currentPage);
					sendDataForImageComparison(`button-${color}`, img)
						.then(result => {
							console.log(result);
							resolve(result);
						});
				}, 10);
			});

			setContent(button);
		});
	}
});