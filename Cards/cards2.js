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
							text: 'Recommended Courses ',
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
							url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduDdUGBhfEEmYZxbpMsxzZlmmElmeOR_5og&usqp=CAU',
							id: 'BigData',
						},
						{
							type: 'Image',
							size: 'Large',
							url: 'https://www.freecodecamp.org/news/content/images/2020/05/Python-language.png',
							id: 'Python',
						},
						{
							type: 'Image',
							size: 'Large',
							horizontalAlignment: 'Left',
							url: 'data:image/png;base64,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',
							id: 'Node',
						},
						{
							type: 'Image',
							size: 'Large',
							url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3EY_Jq9JjoyhbRI6scfuI0Isq9NHciAfrOA&usqp=CAU',
							id: 'CCNA',
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
							text: 'Other Training Courses',
							fontType: 'Default',
							size: 'Medium',
							weight: 'Bolder',
							color: 'Accent',
							separator: true,
						},
					],
				},
				{
					type: 'TextBlock',
					text: 'If you wish to apply for  courses, please let me know :\n',
					wrap: true,
					separator: true,
				},
				{
					type: 'Input.ChoiceSet',
					choices: [
						{
							title: 'Big Data',
							value: 'Big Data',
						},
						{
							title: 'Python',
							value: 'Python',
						},
						{
							title: 'Node',
							value: 'Node',
						},
						{
							title: 'Cisco CCNA',
							value: 'Cisco CCNA',
						},
					],
					id: 'courseName',
					placeholder: '---Select the course---',
				},
				{
					type: 'ActionSet',
					actions: [
						{
							type: 'Action.Submit',
							title: 'Proceed',
							id: 'proceedCourse',
							style: 'positive',
						},
					],
				},
			],
		};

		return course;
	},
	
	myPortfolio: (user, certificateObj) => {
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
							text: 'Courses',
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
							text: 'Certificate',
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
	showSkills: (skills) => {
		return {
			type: 'AdaptiveCard',
			$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
			version: '1.3',
			body: [
				{
					type: 'TextBlock',
					wrap: true,
					fontType: 'Default',
					size: 'Medium',
					color: 'Good',
					text: 'Your Skills : - ',
				},
				{
					type: 'Container',
					items: [
						{
							type: 'TextBlock',
							wrap: true,
							size: 'Large',
							text: `${skills}`,
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
									size: 'Medium',
									color: 'Good',
									text: 'has been successfully added to your portfolio. You can view you skills in ‘My Portfolio’ section anytime.',
								},
							],
						},
					],
					separator: true,
				},
			],
		};
	},
};
