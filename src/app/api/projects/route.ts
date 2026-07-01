import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { createProjectSchema } from "@/lib/validation/project";

export async function GET() { try { const user=await requireUser(); const projects=await db.project.findMany({where:{workspaceId:user.workspaceId},orderBy:{updatedAt:"desc"},take:50}); return NextResponse.json({projects}); } catch(e){return apiError(e);} }
export async function POST(req:NextRequest){try{const user=await requireUser();const input=createProjectSchema.parse(await req.json());const project=await db.project.create({data:{...input,workspaceId:user.workspaceId,userId:user.id}});return NextResponse.json({project},{status:201});}catch(e){return apiError(e);}}
