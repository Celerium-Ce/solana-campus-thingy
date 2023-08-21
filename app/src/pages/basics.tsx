import type { NextPage } from 'next';
import { useState } from 'react';
import * as Web3 from '@solana/web3.js';
import { Navbar } from '@/components/Navbar';
import { Flex, Text, useToast, Button, Input } from '@chakra-ui/react';

const Basics: NextPage = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const toast = useToast();

  const addressSubmittedHandler = (address: string) => {
    try {
      setAddress(address);
      const key = new Web3.PublicKey(address);
      const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
      connection.getBalance(key).then(balance => {
        setBalance(balance / Web3.LAMPORTS_PER_SOL);
      });
    } catch (error) {
      setAddress('');
      setBalance(0);
      toast({
        status: "error",
        title: error.toString()
      });
    }
  };

  const handleAirdrop = async () => {
    try {
      const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
      const key = new Web3.PublicKey(address);
      const airdropSignature = await connection.requestAirdrop(key, Web3.LAMPORTS_PER_SOL);
      await connection.confirmTransaction(airdropSignature);
      toast({
        status: "success",
        title: "Airdrop successful!"
      });
      // Refresh balance after airdrop
      addressSubmittedHandler(address);
    } catch (error) {
      toast({
        status: "error",
        title: error.toString()
      });
    }
  };

  return (
    <>
      <Navbar />
      <Flex direction="column" align="center" justify="center" height="100vh" bg="#05070D">
        <Text fontSize="2xl" color="white" mb="4">
          Start Your Solana Journey
        </Text>
        <Input
          id="public-key"
          className="border p-2 rounded-md"
          type="text"
          placeholder="Public Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          mb="4"
          width="300px" 
          color="white" 
        />
        <Button colorScheme="blue" onClick={() => addressSubmittedHandler(address)}>
          Check SOL Balance
        </Button>
        <Text mt="4" color="white">{`Address: ${address}`}</Text>
        <Text color="white">{`Balance: ${balance} SOL`}</Text>
        <Button colorScheme="blue" mt="4" onClick={handleAirdrop}>
          Request Airdrop
        </Button>
      </Flex>
    </>
  );
}

export default Basics;
