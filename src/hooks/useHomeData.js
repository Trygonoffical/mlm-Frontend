// src/hooks/useHomeData.js
// 'use client'
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectData, initializeData } from '@/redux/slices/homeSlice';

export const useHomeData = (key) => {
    const dispatch = useDispatch();
    
    // Use useSelector directly
    const data = useSelector(state => selectData(state, key));

    useEffect(() => {
        dispatch(initializeData());
    }, [dispatch]);

    return data;
};