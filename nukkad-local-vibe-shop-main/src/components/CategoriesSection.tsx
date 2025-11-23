import { ShoppingCart, Pill, Cake, BookOpen, Sparkles, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
	{
		name: 'Groceries',
		icon: ShoppingCart,
		emoji: '🥦',
		color: 'bg-gradient-accent-light',
		description: 'Fresh produce & essentials',
	},
	{
		name: 'Pharmacy',
		icon: Pill,
		emoji: '💊',
		color: 'bg-gradient-primary-light',
		description: 'Health & wellness',
	},
	{
		name: 'Bakery',
		icon: Cake,
		emoji: '🧁',
		color: 'bg-gradient-secondary-light',
		description: 'Fresh baked goods',
	},
	{
		name: 'Stationery',
		icon: BookOpen,
		emoji: '📚',
		color: 'bg-gradient-accent-light',
		description: 'Books & supplies',
	},
	{
		name: 'Personal Care',
		icon: Sparkles,
		emoji: '🧼',
		color: 'bg-gradient-primary-light',
		description: 'Beauty & hygiene',
	},
	{
		name: 'Café',
		icon: Coffee,
		emoji: '☕',
		color: 'bg-gradient-secondary-light',
		description: 'Coffee & snacks',
	},
];

export const CategoriesSection = () => {
	const navigate = useNavigate();

	const handleCategoryClick = (categoryName: string) => {
		// Navigate to deals page with category filter
		navigate(
			`/deals?category=${encodeURIComponent(
				categoryName
			)}&filters=true`
		);
	};

	const handleViewAllCategories = () => {
		// Navigate to deals page with filters shown
		navigate('/deals?filters=true');
	};

	return (
		<section className="py-20 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16 fade-in-up">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Shop by{' '}
						<span className="bg-gradient-primary bg-clip-text text-transparent">
							Category
						</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Explore what your neighborhood has to offer
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
					{categories.map((category, index) => {
						const IconComponent = category.icon;
						return (
							<div
								key={category.name}
								className="group category-card cursor-pointer"
								style={{ animationDelay: `${index * 0.1}s` }}
								onClick={() => handleCategoryClick(category.name)}
							>
								<div className="bg-card rounded-3xl p-6 text-center shadow-card hover:shadow-floating transition-smooth card-3d">
									<div
										className={`w-16 h-16 ${category.color} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:animate-pulse-glow`}
									>
										<span className="text-2xl">{category.emoji}</span>
									</div>

									<h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
										{category.name}
									</h3>

									<p className="text-sm text-muted-foreground group-hover:text-foreground transition-smooth">
										{category.description}
									</p>

									<div className="mt-4 opacity-0 group-hover:opacity-100 transition-smooth">
										<div className="inline-flex items-center text-primary text-sm font-medium">
											Explore
											<IconComponent className="ml-1 h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="text-center mt-12 fade-in-up">
					<button
						onClick={handleViewAllCategories}
						className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-smooth"
					>
						View All Categories
						<span className="ml-1 text-lg">→</span>
					</button>
				</div>
			</div>
		</section>
	);
};