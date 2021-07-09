module.exports = {
	showPortfolio: () => {
		return {
			type: 'AdaptiveCard',
			body: [
				{
					type: 'TextBlock',
					size: 'Medium',
					weight: 'Bolder',
					text: 'My PortFolio',
				},
				{
					type: 'ColumnSet',
					columns: [
						{
							type: 'Column',
							items: [
								{
									type: 'TextBlock',
									weight: 'Bolder',
									text: 'Anushka',
									wrap: true,
								},
							],
							width: 'stretch',
						},
					],
				},
				{
					type: 'TextBlock',
					text: 'Certificates Added: 222',
					wrap: true,
				},
				{
					type: 'TextBlock',
					text: 'Course Provider: Udemy',
					wrap: true,
				},
				{
					type: 'TextBlock',
					wrap: true,
					text: 'Skills Added: Javascript\n',
				},
			],
			$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
			version: '1.1',
		};
	},
};
