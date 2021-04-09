let quotes = [
	{
		txt:"It always seems impossible until it's done",
		aur:"Nelson Mandela",
	},{
		txt:"The way to get started is to quit talking and begin doing.",
		aur:"Walt Disney",
	},{
		txt:"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
		aur:"Steve Jobs"
	},{
		txt:"If life were predictable it would cease to be life, and be without flavor.",
		aur:"Eleanor Roosevelt"
	},{
		txt:"If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
		aur:"Oprah Winfrey"
	},{
		txt:"If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
		aur:"James Cameron"
	},{
		txt:"Life is what happens when you're busy making other plans.",
		aur:"John Lennon"
	},{
		txt:"Spread love everywhere you go. Let no one ever come to you without leaving happier.",
		aur:"Mother Teresa"
	},{
		txt:"When you reach the end of your rope, tie a knot in it and hang on.",
		aur:"Franklin D. Roosevelt"
	},{
		txt:"Always remember that you are absolutely unique. Just like everyone else.",
		aur:"Margaret Mead",
	},{
		txt:"Don't judge each day by the harvest you reap but by the seeds that you plant.",
		aur:"Robert Louis Stevenson",
	},{
		txt:"The future belongs to those who believe in the beauty of their dreams.",
		aur:"Eleanor Roosevelt",
	},{
		txt:"Tell me and I forget. Teach me and I remember. Involve me and I learn.",
		aur:"Benjamin Franklin",
	},{
		txt:"The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
		aur:"Helen Keller",
	},{
		txt:"It is during our darkest moments that we must focus to see the light.",
		aur:"Aristotle",
	},{
		txt:"Whoever is happy will make others happy too.",
		aur:"Anne Frank"
	},{
		txt:"Do not go where the path may lead, go instead where there is no path and leave a trail.",
		aur:"Ralph Waldo Emerson"
	},{
		txt:"You will face many defeats in life, but never let yourself be defeated.",
		aur:"Maya Angelou",
	},{
		txt:"The greatest glory in living lies not in never falling, but in rising every time we fall.",
		aur:"Nelson Mandela",
	},{
		txt:"In the end, it's not the years in your life that count. It's the life in your years.",
		aur:"Abraham Lincoln",
	},{
		txt:"Never let the fear of striking out keep you from playing the game.",
		aur:"Babe Ruth",
	},{
		txt:"Life is either a daring adventure or nothing at all.",
		aur:"Helen Keller",
	},{
		txt:"Many of life's failures are people who did not realize how close they were to success when they gave up.",
		aur:"Thomas A. Edison",
	},{
		txt:"You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
		aur:"Dr. Seuss",
	},
	{txt: 'He who angers you conquers you.', aur: 'Elizabeth Kenny'},
	{txt: 'Beauty, without expression, tires.', aur: 'Ralph Waldo Emerson'},
	{txt: 'The secret of business is to know something that nobody else knows.', aur: 'Aristotle Onassis'},
	{txt: 'The greatest discovery of all time is that a person can change his future by merely changing his attitude.', aur: 'Oprah Winfrey'},
	{txt: 'We cannot always build the future of our youth, but we can build our youth for the future.', aur: 'Franklin D. Roosevelt'},
	{txt: 'It takes courage to grow up and turn out to be who you really are.', aur: 'E.E. Cummings'},
	{txt: 'In this world nothing can be said to be certain, except death and taxes.', aur: 'Benjamin Franklin'},
	{txt: 'It is the mark of an educated mind to be able to entertain a thought without accepting it.', aur: 'Aristotle'},
	{txt: 'A happy family is but an earlier heaven.', aur: 'George Bernard Shaw'},
	{txt: 'Don’t walk in front of me, I may not follow. Don’t walk behind me, I may not lead. Walk beside me and be my friend.', aur: 'Albert Camus'},
	{txt: "Courage doesn’t always roar. Sometimes courage is the little voice at the end of the day that says ‘I’ll try again tomorrow.'", aur: 'Mary Anne Radmacher'},
	{txt: 'Education is like a double-edged sword. It may be turned to dangerous uses if it is not properly handled.', aur: 'Wu Ting-Fang'},
	{txt: 'Walking with a friend in the dark is better than walking alone in the light.', aur: 'Helen Keller'},
	{txt: 'Happiness is not a goal; it is a by-product.', aur: 'Eleanor Roosevelt'},
	{txt: 'Always forgive your enemies; nothing annoys them so much.', aur: 'Oscar Wilde'},
	{txt: 'The only true wisdom is knowing that you know nothing.', aur: 'Socrates'},
	{txt: 'Remember no one can make you feel inferior without your consent.', aur: 'Eleanor Roosevelt'},
	{txt: 'For every minute you are angry you lose sixty seconds of happiness.', aur: 'Ralph Waldo Emerson'},
	{txt: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.', aur: 'Lao Tzu'},
	{txt: 'There are two ways of spreading light: to be the candle or the mirror that reflects it.', aur: 'Edith Wharton'},
	{txt: 'The road to success and the road to failure are almost exactly the same.', aur: 'Colin R. Davis'},
	{txt: 'Motivation is a fire from within. If someone else tries to light that fire under you, chances are it will burn very briefly.', aur: 'Stephen R. Covey'},
	{txt: 'In three words I can sum up everything I’ve learned about life: It goes on.', aur: 'Robert Frost'},
	{txt: 'Self-reverence, self-knowledge, self control — these three alone lead to power.', aur: 'Alfred, Lord Tennyson'},
	{txt: 'Though no one can go back and make a brand new start, anyone can start from now and make a brand new ending.', aur: 'Carl Bard'},
	{txt: 'Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young. The greatest thing in life is to keep your mind young.', aur: 'Henry Ford'},
	{txt: 'If you want to lift yourself up, lift up someone else.', aur: 'Booker T. Washington'},
	{txt: 'You miss 100% of the shots you don’t take.', aur: 'Wayne Gretzky'},
	{txt: 'It is never too late to be what you might have been.', aur: 'George Eliot'},
	{txt: 'A person who never made a mistake never tried anything new.', aur: 'Albert Einstein'},
	{txt: 'The person who says it cannot be done should not interrupt the person who is doing it.', aur: 'Chinese Proverb'},
	{txt: 'Great minds discuss ideas; average minds discuss events; small minds discuss people.', aur: 'Eleanor Roosevelt'},
	{txt: 'You only live once, but if you do it right, once is enough.', aur: 'Mae West'},
	{txt: 'If you tell the truth, you don’t have to remember anything.', aur: 'Mark Twain'},
	{txt: 'The only thing worse than being blind is having sight but no vision.', aur: 'Helen Keller'},
	{txt: 'To live is the rarest thing in the world. Most people exist, that is all.Oscar Wilde', aur: 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.Martin Luther King, Jr.'},
	{txt: 'The only thing we have to fear is fear itself.', aur: 'Franklin D. Roosevelt'},
	{txt: 'If you look at what you have in life, you’ll always have more. If you look at what you don’t have in life, you’ll never have enough.', aur: 'Oprah Winfrey'},
	{txt: 'The best way to predict the future is to invent it.', aur: 'Alan Kay'},
	{txt: 'If I am not for myself, who is for me? And if I am only for myself, what am I? And if not now, when?', aur: 'Rabbi Hillel'},
	{txt: 'Everything has beauty, but not everyone can see.', aur: 'Confucius'},
	{txt: 'Believe you can and you’re halfway there.', aur: 'Theodore Roosevelt'},
	{txt: 'How wonderful it is that nobody need wait a single moment before starting to improve the world.', aur: 'Anne Frank'},
	{txt: 'Imagination is everything. It is the preview of life’s coming attractions.', aur: 'Albert Einstein'},
	{txt: 'Change your thoughts and you change your world.', aur: 'Norman Vincent'},
	{txt: 'Happiness is not something ready made. It comes from your own actions.', aur: 'Dalai Lama'},
	{txt: 'Remember that happiness is a way of travel, not a destination.', aur: 'Roy M. Goodman'},
	{txt: 'Too many of us are not living our dreams because we are living our fears.', aur: 'Les Brown'},
	{txt: 'If opportunity doesn’t knock, build a door.', aur: 'Milton Berle'},
	{txt: 'Wise men speak because they have something to say; fools because they have to say something.', aur: 'Plato'},
	{txt: 'Strive not to be a success, but rather to be of value.', aur: 'Albert Einstein'},
	{txt: 'Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.', aur: 'Robert Frost'},
	{txt: 'Do not let what you cannot do interfere with what you can do.', aur: 'John Wooden'},
	{txt: 'Whenever you find yourself on the side of the majority, it is time to pause and reflect.', aur: 'Mark Twain'},
	{txt: 'I haven’t failed. I’ve just found 10,000 ways that won’t work.', aur: 'Thomas Edison'},
	{txt: 'A journey of a thousand leagues begins beneath one’s feet.', aur: 'Lao Tzu'},
	{txt: 'I’ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.', aur: 'Maya Angelou'},
	{txt: 'Either you run the day, or the day runs you.', aur: 'Jim Rohn'},
	{txt: 'Life shrinks or expands in proportion to one’s courage.', aur: 'Anais Nin'},
	{txt: 'You must be the change you wish to see in the world.', aur: 'Mahatma Gandhi'},
	{txt: 'What you do speaks so loudly that I cannot hear what you say.', aur: 'Ralph Waldo Emerson'},
	{txt: 'Believe and act as if it were impossible to fail.', aur: 'Charles Kettering'},
	{txt: 'The difference between ordinary and extraordinary is that little extra.', aur: 'Jimmy Johnson'},
	{txt: 'Be who you are and say what you feel, because those who mind don’t matter and those who matter don’t mind.', aur: 'Bernard M. Baruch'},
	{txt: 'We must not allow other people’s limited perceptions to define us.', aur: 'Virginia Satir'},
	{txt: 'Do what you can, with what you have, where you are.', aur: 'Theodore Roosevelt'},
	{txt: 'Be yourself; everyone else is already taken.', aur: 'Oscar Wilde'},
	{txt: 'This above all: to thine own self be true.', aur: 'William Shakespeare'},
	{txt: 'If you cannot do great things, do small things in a great way.', aur: 'Napoleon Hill'},
	{txt: 'Live as if you were to die tomorrow. Learn as if you were to live forever', aur:'Mahatma Gandhi'},
	{txt: 'That which does not kill us makes us stronger.', aur: 'Friedrich Nietzsche'},
];