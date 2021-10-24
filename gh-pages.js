var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/MysteryDAO/MysteryDAO-site.git', // Update to point to your repository  
        user: {
            name: 'MysteryDAO', // update to use your name
            email: 'mysterydaoofficial@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)