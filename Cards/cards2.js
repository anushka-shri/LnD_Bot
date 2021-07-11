module.exports = {
	coursesForm: () => {
		let course = {
			type: 'AdaptiveCard',
			$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
			version: '1.3',
			body: [
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: 'Add From the following courses ',
							size: 'Medium',
							weight: 'Bolder',
							separator: true,
						},
					],
				},
				{
					type: 'ImageSet',
					images: [
						{
							type: 'Image',
							size: 'Large',
							url: 'https://tse4.mm.bing.net/th?id=OIP.iwj0INva_ovbantYwcz-3AHaE8&pid=Api',
							id: 'CEH',
						},
						{
							type: 'Image',
							size: 'Large',
							url: 'https://analyticsindiamag.com/wp-content/uploads/2021/02/pasted-image-0-3.png',
							id: 'Linux',
						},
						{
							type: 'Image',
							size: 'Large',
							horizontalAlignment: 'Left',
							url: 'https://www.brainvire.com/wp/wp-content/uploads/2016/05/top-7-benefits-of-using-node-js-in-retail-industry-that-cannot-be-ignored.jpg',
							id: 'Node',
						},
						{
							type: 'Image',
							size: 'Large',
							url: 'https://simpleprogrammer.com/wp-content/uploads/2016/11/What-Is-Web-Development.png',
							id: 'Web Development',
						},
						{
							type: 'Image',
							size: 'Large',
							horizontalAlignment: 'Left',
							url: 'https://insidebigdata.com/wp-content/uploads/2019/04/DataScience_shutterstock_1054542323.jpg',
							id: 'Data Science',
						},
						{
							type: 'Image',
							size: 'Large',
							horizontalAlignment: 'Left',
							url: 'https://webmentor.org/blog_images/php-logo.png',
							id: 'PHP',
						},
					],
					horizontalAlignment: 'Left',
					imageSize: 'Large',
					separator: true,
				},
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: 'Select Course Value Here',
							fontType: 'Default',
							size: 'Medium',
							weight: 'Bolder',
							color: 'Good',
							separator: true,
						},
					],
				},
				{
					type: 'Input.ChoiceSet',
					choices: [
						{
							title: 'CEH',
							value: 'CEH',
						},
						{
							title: 'Linux',
							value: 'Linux',
						},
						{
							title: 'Node',
							value: 'Node',
						},
						{
							title: 'Web Development',
							value: 'Web Development',
						},
						{
							title: 'Data Science',
							value: 'Data Science',
						},
						{
							title: 'PHP',
							value: 'PHP',
						},
					],
					id: 'courseName',
					placeholder: 'Select a course',
				},
				{
					type: 'ActionSet',
					actions: [
						{
							type: 'Action.Submit',
							title: 'Submit',
							id: 'proceedCourse',
							style: 'positive',
						},
					],
				},
			],
		};

		return course;
	},
	myPortfolio: (user, certificateObj, skills) => {
		return {
			type: 'AdaptiveCard',
			$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
			version: '1.3',
			body: [
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: 'My Portfolio',
							horizontalAlignment: 'Left',
							size: 'Large',
							color: 'Accent',
							weight: 'Bolder',
						},
					],
					separator: true,
				},
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: 'Courses Added',
							horizontalAlignment: 'Left',
							weight: 'Bolder',
						},
					],
					separator: true,
				},
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: `${user.courses}`,
						},
					],
				},
				{
					type: 'Container',
					separator: true,
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: 'Certificates Added',
							horizontalAlignment: 'Left',
							weight: 'Bolder',
						},
					],
				},
				{
					type: 'Container',
					items: [
						{
							type: 'FactSet',
							facts: certificateObj,
						},
					],
				},
				{
					type: 'Container',
					separator: true,
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: 'Skills Added',
							horizontalAlignment: 'Left',
							weight: 'Bolder',
						},
					],
				},
				{
					type: 'Container',
					items: [
						{
							type: 'FactSet',
							facts: skills,
						},
					],
				},
			],
		};
	},
	showCertificate: (Certnumber, Prov) => {
		return {
			type: 'AdaptiveCard',
			$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
			version: '1.3',
			body: [
				{
					type: 'TextBlock',
					wrap: true,
					text: 'Your Request for adding the certificate with  :-\n',
					fontType: 'Default',
					size: 'Medium',
					color: 'Accent',
				},
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: `Certificate number: ${Certnumber}`,
							size: 'Large',
						},
						{
							type: 'TextBlock',
							wrap: true,
							text: `Provider name: ${Prov}`,
							size: 'Large',
						},
					],
					separator: true,
				},
				{
					type: 'ColumnSet',
					columns: [
						{
							type: 'Column',
							width: 50,
							items: [
								{
									type: 'TextBlock',
									wrap: true,
									text: 'has been successfully added.',
									size: 'Medium',
									color: 'Accent',
								},
							],
						},
					],
					separator: true,
				},
			],
		};
	},
	showSkills: (skills, Prov) => {
		return {
			type: 'AdaptiveCard',
			$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
			version: '1.3',
			body: [
				{
					type: 'TextBlock',
					wrap: true,
					text: 'Your Request for adding the certificate with  :-\n',
					fontType: 'Default',
					size: 'Medium',
					color: 'Accent',
				},
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: `Skills: ${skills}`,
							size: 'Large',
						},
						{
							type: 'TextBlock',
							wrap: true,
							text: `Provider name: ${Prov}`,
							size: 'Large',
						},
					],
					separator: true,
				},
				{
					type: 'ColumnSet',
					columns: [
						{
							type: 'Column',
							width: 50,
							items: [
								{
									type: 'TextBlock',
									wrap: true,
									text: 'has been successfully added.',
									size: 'Medium',
									color: 'Accent',
								},
							],
						},
					],
					separator: true,
				},
			],
		};
	},
	showCourse: (courseName) => {
		return {
			type: 'AdaptiveCard',
			$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
			version: '1.3',
			body: [
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							text: `Do you want to add ${courseName} to your portfolio?`,
							color: 'Accent',
							weight: 'Bolder',
						},
					],
					separator: true,
				},

				{
					type: 'Container',
					items: [
						{
							type: 'ActionSet',
							actions: [
								{
									type: 'Action.Submit',
									id: 'ApplyCourse',
									title: 'Add to Portfolio',
									style: 'positive',
								},
							],
						},
					],
				},
			],
		};
	},
};
