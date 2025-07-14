import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Mic, Trophy, Star } from 'lucide-react';
import wiseOwl from '@/assets/wise-owl-mascot.jpg';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple/5 to-accent/5 p-4 font-fredoka">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-12">
          <div className="flex justify-center mb-6">
            <img 
              src={wiseOwl} 
              alt="Wise Owl Mascot" 
              className="w-32 h-32 rounded-full border-4 border-primary shadow-xl animate-float" 
            />
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary via-pink to-accent bg-clip-text text-transparent animate-rainbow leading-tight">
            ✨ Speech Magic Academy ✨
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium max-w-4xl mx-auto">
            Welcome to the most magical place to learn pronunciation! 
            Practice speaking, earn stars, and become a speech wizard! 🧙‍♂️✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Link to="/practice">
              <Button 
                variant="magical" 
                size="lg" 
                className="text-2xl px-12 py-6 rounded-2xl font-bold hover:scale-110 transition-all duration-300"
              >
                <Mic className="h-8 w-8 mr-3" />
                Start Speaking! 🎤
              </Button>
            </Link>
            
            <Link to="/achievements">
              <Button 
                variant="celebration" 
                size="lg" 
                className="text-2xl px-12 py-6 rounded-2xl font-bold hover:scale-110 transition-all duration-300"
              >
                <Trophy className="h-8 w-8 mr-3" />
                My Achievements 🏆
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-purple/10 to-pink/10 border-2 border-purple/30 hover:scale-105 transition-all duration-300 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple/20 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-8 w-8 text-purple animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-fredoka text-purple">
                🎤 Record Your Voice
              </CardTitle>
              <CardDescription className="text-lg">
                Speak clearly into your microphone and watch the magical sound waves dance!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-yellow/10 to-orange/10 border-2 border-yellow/30 hover:scale-105 transition-all duration-300 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow/20 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-yellow animate-star-sparkle" />
              </div>
              <CardTitle className="text-2xl font-fredoka text-orange">
                ⭐ Earn Magic Stars
              </CardTitle>
              <CardDescription className="text-lg">
                Get star ratings for each word you pronounce correctly. Collect them all!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-blue/10 border-2 border-success/30 hover:scale-105 transition-all duration-300 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-success animate-bounce-soft" />
              </div>
              <CardTitle className="text-2xl font-fredoka text-success">
                🏆 Unlock Achievements
              </CardTitle>
              <CardDescription className="text-lg">
                Become a Pronunciation Pro, Fluency Master, and Speech Star!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-card to-primary/5 border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-fredoka text-primary flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 animate-star-sparkle" />
              How the Magic Works
              <Sparkles className="h-10 w-10 animate-star-sparkle" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple to-pink rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-fredoka font-bold text-purple">Read the Sentence</h3>
                <p className="text-muted-foreground">Choose a fun sentence and get ready to speak!</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue to-purple rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-fredoka font-bold text-blue">Record Your Voice</h3>
                <p className="text-muted-foreground">Press the magical microphone and speak clearly!</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow to-orange rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-fredoka font-bold text-orange">Get Your Stars</h3>
                <p className="text-muted-foreground">See how many stars you earned for each word!</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-success to-blue rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-fredoka font-bold text-success">Become a Wizard</h3>
                <p className="text-muted-foreground">Practice more and unlock amazing achievements!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-12">
          <h2 className="text-5xl font-fredoka font-bold text-primary mb-6">
            Ready to Start Your Speech Adventure? 🌟
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of kids who are already practicing and improving their pronunciation skills!
          </p>
          <Link to="/practice">
            <Button 
              variant="magical" 
              size="lg" 
              className="text-3xl px-16 py-8 rounded-2xl font-bold hover:scale-110 transition-all duration-300 animate-pulse-glow"
            >
              <Sparkles className="h-10 w-10 mr-4" />
              Let's Go! ✨
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;