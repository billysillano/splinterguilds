import ghpages from 'gh-pages';

ghpages.publish(
    'dist', // path to public directory
    {
        branch: 'main',
        repo: 'https://github.com/bo0mburst/splinterguilds.git', // Update to point to your repository  
        user: {
            name: 'Billy Sillano', // update to use your name
            email: 'billysillano@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)